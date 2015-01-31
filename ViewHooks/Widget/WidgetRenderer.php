<?php
namespace Cogipix\CogimixVimeoBundle\ViewHooks\Widget;
use Cogipix\CogimixCommonBundle\ViewHooks\Widget\WidgetRendererInterface;

/**
 *
 * @author plfort - Cogipix
 *
 */
class WidgetRenderer implements WidgetRendererInterface
{


    public function getWidgetTemplate()
    {
        return 'CogimixVimeoBundle:Widget:widget.html.twig';
    }

    public function getParameters(){
        return array();
    }

}
