<?php
namespace Cogipix\CogimixVimeoBundle\Services;

use Cogipix\CogimixCommonBundle\Entity\Song;

class ResultBuilder{


    private $pictureHost = 'https://i.vimeocdn.com/video/';
    private $defaultThumbnails = '/bundles/cogimixvimeo/images/vimeo-default.png';
    public function createFromVideoEntry($videoEntry){

        $item = null;
        if($videoEntry !== null ){
            $item = new Song();
            $item->setEntryId(substr($videoEntry['uri'], strrpos($videoEntry['uri'], '/') + 1));

            if(strstr($videoEntry['name'],'-' )!==false){
                $artistTitle = explode('-', $videoEntry['name']);
                $item->setArtist(trim($artistTitle[0]));
                $item->setTitle(trim($artistTitle[1]));
            }else{
                $item->setTitle($videoEntry['name']);

            }

            $item->setDuration($videoEntry['duration']);
            $item->setThumbnails($this->defaultThumbnails);
            if(isset($videoEntry['pictures']) && is_array($videoEntry['pictures'])){
                if(isset($videoEntry['pictures']['uri'])){
                    $pictureId = substr($videoEntry['pictures']['uri'], strrpos($videoEntry['pictures']['uri'], '/') + 1);
                    $item->setThumbnails($this->pictureHost.$pictureId.'_200.jpg');
                }
            }

            $item->setTag($this->getResultTag());
            $item->setIcon($this->getDefaultIcon());
        }

        return $item;
    }

    public function createFromVideoEntries($videosEntries){

        $result = array();
        foreach($videosEntries as $videoEntry){
            $item = $this->createFromVideoEntry($videoEntry);
            if($item !== null ){
                $result[] = $item;
            }
        }

        return $result;
    }


    public function getDefaultIcon(){
        return 'bundles/cogimixvimeo/images/vimeo-icon.png';
    }

    public function getResultTag(){
        return 'vimeo';
    }
}