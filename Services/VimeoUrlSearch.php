<?php
namespace Cogipix\CogimixVimeoBundle\Services;


use Cogipix\CogimixCommonBundle\Model\ParsedUrl;

use Cogipix\CogimixVimeoBundle\Services\ResultBuilder;
use Cogipix\CogimixCommonBundle\MusicSearch\UrlSearcherInterface;
use Cogipix\CogimixVimeoBundle\Services\VimeoMusicSearch;
class VimeoUrlSearch implements UrlSearcherInterface
{
    private $regexHost = '#^(?:www\.)?(?:vimeo\.com)#';
    private $resultBuilder;
    private $vimeoPlugin;

    public function __construct(ResultBuilder $resultBuilder, VimeoMusicSearch $vimeoPlugin ){
        $this->resultBuilder = $resultBuilder;
        $this->vimeoPlugin = $vimeoPlugin;
    }


    public function canParse($host)
    {

        preg_match($this->regexHost, $host,$matches);

       return isset($matches[0]) ? $matches[0] : false;

    }

    public function searchByUrl(ParsedUrl $url)
    {

        if( ($match = $this->canParse($url->host)) !== false){

            $videoId = substr($url->path, strrpos($url->path, '/') + 1);

            var_dump($videoId);die();
            return  $this->vimeoPlugin->getVideo($videoId);
        }else{
            return null;
        }


    }





}
