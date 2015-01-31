<?php
namespace Cogipix\CogimixVimeoBundle\ViewHooks\Javascript;
use Cogipix\CogimixCommonBundle\ViewHooks\Javascript\JavascriptImportInterface;

/**
 *
 * @author plfort
 *
 */
class JavascriptImportRenderer implements JavascriptImportInterface
{

    public function getJavascriptImportTemplate()
    {
        return 'CogimixVimeoBundle::js.html.twig';
    }

}
