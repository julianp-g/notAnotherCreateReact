/**
 * editor_plugin_src.js
 *
 * Copyright 2009, Moxiecode Systems AB
 * Released under LGPL License.
 *
 * License: http://tinymce.moxiecode.com/license
 * Contributing: http://tinymce.moxiecode.com/contributing
 */

(function() {
    /**
     * Auto Resize
     *
     * This plugin automatically resizes the content area to fit its content height.
     * It will retain a minimum height, which is the height of the content area when
     * it's initialized.
     */
    function getParam(ed, name) {
        return ed.getParam(name, defs[name]);
    }

    tinymce.create('tinymce.plugins.AutoResizePlugin', {
        /**
         * Initializes the plugin, this will be executed after the plugin has been created.
         * This call is done before the editor instance has finished it's initialization so use the onInit event
         * of the editor instance to intercept that event.
         *
         * @param {tinymce.Editor} ed Editor instance that the plugin is initialized in.
         * @param {string} url Absolute URL to where the plugin is located.
         */

        forceResize : null,
        init : function(ed, url) {
            var t = this, oldSize = 0;
            var isFirefox = _gliffy.BrowserDetect.browser === 'Firefox';

            if (ed.getParam('fullscreen_is_enabled'))
                return;

            /**
             * This method gets executed each time the editor needs to resize.
             */
            function resize() {
                var deltaSize, d = ed.getDoc(), body = d.body, de = d.documentElement, DOM = tinymce.DOM, resizeHeight = t.autoresize_min_height, myHeight, myWidth;
                DOM.setStyle(ed.getContentAreaContainer().firstChild, 'height', '0px');

                // Get height differently depending on the browser used
                //myHeight = tinymce.isIE ? body.scrollHeight : (tinymce.isWebKit && body.clientHeight == 0 ? 0 : body.offsetHeight);
                //GLIFFY Mod: just use JQuery here.  Those other values are wrong on chrome.
                // Firefox dies on this because of a bug in jQuery
                try {
                    myHeight = isFirefox ? body.offsetHeight : $(body).height();
                } catch(e) {
                    myHeight = 0;
                }
                var resizeWidth = 1;
                if (t.autoresize_should_resize_width_callback()){
                    var spans = $(body).find('span,p');
                    for(var i=0; i<spans.length; i++){
                        $(spans[i]).css('display', 'inline-block');
                        var elWidth = isFirefox ? spans[i].offsetWidth + 10 : $(spans[i]).width();
                        if (elWidth > resizeWidth){
                            //fudge factor added for non firefox.
                            resizeWidth = elWidth + (t.autoresize_should_ignore_pixel_padding() ? 0 : 25);
                        }
                        $(spans[i]).css('display', '');
                    }
                }

                // Don't make it smaller than the minimum height
                if (myHeight > t.autoresize_min_height){
                    resizeHeight = myHeight;
                }

                // If a maximum height has been defined don't exceed this height
                if (t.autoresize_max_height && myHeight > t.autoresize_max_height) {
                    resizeHeight = t.autoresize_max_height;
                    body.style.overflowY = "auto";
                    de.style.overflowY = "auto"; // Old IE
                } else {
                    body.style.overflowY = "hidden";
                    de.style.overflowY = "hidden"; // Old IE
                    body.scrollTop = 0;
                }

                // Resize content element
                //if (resizeHeight !== oldSize) //GLIFFY MOD: ALWAYS RESIZE
                {
                    deltaSize = resizeHeight - oldSize;
                    DOM.setStyle(DOM.get(ed.id + '_ifr'), 'height', resizeHeight + 'px');

                    if (t.autoresize_should_resize_width_callback()){
                        DOM.setStyle(DOM.get(ed.id + '_ifr'), 'width', resizeWidth + 'px');
                    }
                    else{
                        DOM.setStyle(DOM.get(ed.id + '_ifr'), 'width', '100%');
                    }

                    oldSize = resizeHeight;

                    // WebKit doesn't decrease the size of the body element until the iframe gets resized
                    // So we need to continue to resize the iframe down until the size gets fixed
                    if (tinymce.isWebKit && deltaSize < 0){
                        resize();
                    }
                    else{
                        if (t.autoresize_on_resize){
                            t.autoresize_on_resize(
                                t.editor,
                                t.autoresize_should_resize_width_callback() ? resizeWidth : null,
                                resizeHeight);
                        }
                    }

                }
            };

            this.forceResize = resize;

            t.editor = ed;

            // Define minimum height
            t.autoresize_min_height = parseInt(ed.getParam('autoresize_min_height', ed.getElement().offsetHeight));

            // Define maximum height
            t.autoresize_max_height = parseInt(ed.getParam('autoresize_max_height', 0));

            t.autoresize_should_resize_width_callback = ed.getParam('autoresize_should_resize_width_callback', function(){ return false });
            t.autoresize_should_ignore_pixel_padding = ed.getParam('autoresize_should_ignore_pixel_padding', function(){ return false });
            t.autoresize_on_resize = ed.getParam('autoresize_on_resize', null);

            // Add padding at the bottom for better UX
            ed.onInit.add(function(ed){
                ed.dom.setStyle(ed.getBody(), 'paddingBottom', ed.getParam('autoresize_bottom_margin', 50) + 'px');

                var style = null;

                //add a nowrap css rule for paragraphs if resize_width is on.
                ed.onSetContent.add( function(ed){
                    var doc = ed.getDoc();
                    var head = doc.getElementsByTagName('head')[0];

                    if (style){
                        head.removeChild(style);
                        style = null;
                    }

                    if (t.autoresize_should_resize_width_callback()){
                        var rules = doc.createTextNode('body p { white-space: nowrap; }');
                        style = doc.createElement('style')
                        style.type = 'text/css';
                        if(style.styleSheet)
                            style.styleSheet.cssText = rules.nodeValue;
                        else style.appendChild(rules);
                        head.appendChild(style);
                    }
                });
            });

            // Add appropriate listeners for resizing content area
            ed.onChange.add(resize);
            ed.onSetContent.add(resize);
            ed.onPaste.add(resize);
            ed.onKeyUp.add(resize);
            ed.onPostRender.add(resize);

            //tinyMCE doesn't fire events for sizing, search for FontName|FontSize in tiny_mce.js for details
            ed.onExecCommand.add(function (ed, cmd){
                setTimeout( function(){
                    if (cmd === 'FontSize' || cmd === 'FontName'){
                        resize(ed);
                    }
                }, 1);
            });

            if (ed.getParam('autoresize_on_init', true)) {
                ed.onLoad.add(resize);
                ed.onLoadContent.add(resize);
            }

            // Register the command so that it can be invoked by using tinyMCE.activeEditor.execCommand('mceExample');
            ed.addCommand('mceAutoResize', resize);
        },

        /**
         * Returns information about the plugin as a name/value array.
         * The current keys are longname, author, authorurl, infourl and version.
         *
         * @return {Object} Name/value array containing information about the plugin.
         */
        getInfo : function() {
            return {
                longname : 'Auto Resize',
                author : 'Moxiecode Systems AB',
                authorurl : 'http://tinymce.moxiecode.com',
                infourl : 'http://wiki.moxiecode.com/index.php/TinyMCE:Plugins/autoresize',
                version : tinymce.majorVersion + "." + tinymce.minorVersion
            };
        }
    });

    // Register plugin
    tinymce.PluginManager.add('autoresize', tinymce.plugins.AutoResizePlugin);
})();
