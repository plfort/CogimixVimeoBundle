<?php
namespace Cogipix\CogimixVimeoBundle\Services;

use Cogipix\CogimixCommonBundle\Entity\TrackResult;
use Cogipix\CogimixCommonBundle\MusicSearch\AbstractMusicSearch;
use Vimeo\Vimeo;
class VimeoMusicSearch extends AbstractMusicSearch{

    private $vimeoClient;

    private $resultBuilder;

    public function __construct(ResultBuilder $resultBuilder,Vimeo $vimeoClient){
        $this->resultBuilder=$resultBuilder;
        $this->vimeoClient=$vimeoClient;

    }

    protected function parseResponse($responseBody){


        $result = array();
        if(isset($responseBody['data']) && is_array($responseBody['data'])){
            foreach($responseBody['data'] as $videoENtry){
                $item= $this->resultBuilder->createFromVideoEntry($videoENtry);
                $result[]=$item;
            }
        }

        $this->logger->info('Vimeo return '.count($result).' results');
        return $result;
    }

    protected function executeQuery(){
        $this->logger->info('Vimeo executeQuery');

        try{
            $response = $this->vimeoClient->request('/videos',array('query'=>$this->searchQuery->getSongQuery()),'GET');

            if($response['status'] == 200){
                return $this->parseResponse($response['body']);
            }
        }catch(\Exception $ex){
            $this->logger->err($ex);

        }
        return array();


    }

    public function getVideo($videoId)
    {
        try{
            $response = $this->vimeoClient->request('/videos/'.$videoId);
            var_dump($response);die();
            if($response['status'] == 200){

                return $this->parseResponse($response['body']);
            }
        }catch(\Exception $ex){
            $this->logger->err($ex);

        }
        return array();
    }

    protected function executePopularQuery(){

        return array();

    }

    protected function buildQuery(){


    }

    public function  getName(){
        return 'Vimeo';
    }

    public function  getAlias(){
        return 'vimeo';
    }

    public function getDefaultIcon(){
        return 'bundles/cogimixvimeo/images/vimeo-icon.png';
    }

    public function getResultTag(){
        return 'vimeo';
    }


}

?>