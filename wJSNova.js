/******************************************
 * Websanova.com
 *
 * Resources for web entrepreneurs
 *
 * @author          Websanova
 * @copyright       Copyright (c) 2012 Websanova.
 * @license         This websanova JSNova jQuery plugin is dual licensed under the MIT and GPL licenses.
 * @link            http://www.websanova.com
 * @github			http://github.com/websanova/wJSNova
 * @version         Version 1.1.0
 *
 ******************************************/

(function($)
{
	$.fn.wJSNova = function(option, settings)
	{	
		if(typeof option === 'object')
		{
			settings = option;
		}
		else if(typeof option === 'string')
		{
			var data = this.data('_wJSNova');

			if(data)
			{
				if(option == 'resize') { data.resize(); return true }
				else if($.fn.wJSNova.defaultSettings[option] !== undefined)
				{
					if(settings !== undefined){
						data.settings[option] = settings;
						return true;
					}
					else return data.settings[option];
				}
				else return false;
			}
			else return false;
		}

		settings = $.extend({}, $.fn.wJSNova.defaultSettings, settings || {});

		return this.each(function()
		{
			var $elem = $(this);

			var $settings = jQuery.extend(true, {}, settings);

			var jsn = new JSNova($settings);

			$elem.append(jsn.generate());
			jsn.resize();

			$elem.data('_wJSNova', jsn);
		});
	}

	$.fn.wJSNova.defaultSettings = {};

	function JSNova(settings)
	{
		this.jsn = null;
		this.settings = settings;

		this.menu = null;

		this.sidebar = null;
		this.jQueryVersion = null;
		this.jQueryUIVersion = null;
		this.jQueryUITheme = null;

		this.codeArea = null;
		this.boxHTML = null;
		this.boxCSS = null;
		this.boxJS = null;
		this.boxResult = null;

		return this;
	}

	JSNova.prototype = 
	{
		init: function()
		{
			this.resize();
		},
		
		generate: function()
		{
			var $this = this;

			if($this.jsn) return $this.jsn;

			/************************************************
			 * Menu
			 ************************************************/
			var menuButton_run = $('<span class="_wJSNova_menuButton">Run</span>').click(function(){$this.run();});
			var menuButton_reset = $('<span class="_wJSNova_menuButton">Reset</span>').click(function(){$this.reset();});

			$this.menu = 
			$('<div class="_wJSNova_menu"></div>')
			.append(
				$('<div class="_wJSNova_menuPadding"></div>')
				.append(menuButton_run)
				.append(' <span class="_wJSNova_menuBullet">&bull;</span> ')
				.append(menuButton_reset)
			);
			
			/************************************************
			 * Sidebar
			 ************************************************/
			$this.jQueryVersion = $('<select class="_wJSNova_sidebarSelect"></seletct>');
			$.each(['1.7.2', '1.7.1', '1.7.0', '1.6.4', '1.6.3', '1.6.2', '1.6.1', '1.6.0', '1.5.2', '1.5.1', '1.5.0', '1.4.4', '1.4.3', '1.4.2', '1.4.1', '1.4.0', '1.3.2', '1.3.1', '1.3.0', '1.2.6', '1.2.3'],
			function(index,version){ $this.jQueryVersion.append('<option value="https://ajax.googleapis.com/ajax/libs/jquery/' + version + '/jquery.min.js">jQuery ' + version + '</option>'); });	

			$this.jQueryUIVersion = $('<select class="_wJSNova_sidebarSelect"></seletct>');
			$.each(['1.8.18', '1.8.17', '1.8.16', '1.8.15', '1.8.14', '1.8.13', '1.8.12', '1.8.11', '1.8.10', '1.8.9', '1.8.8', '1.8.7', '1.8.6', '1.8.5', '1.8.4', '1.8.2', '1.8.1', '1.8.0', '1.7.3', '1.7.2', '1.7.1', '1.7.0', '1.6.0', '1.5.3', '1.5.2'],
			function(index,version){ $this.jQueryUIVersion.append('<option value="https://ajax.googleapis.com/ajax/libs/jqueryui/' + version + '/jquery-ui.min.js">jQuery UI ' + version + '</option>'); });

			$this.jQueryUITheme = $('<select class="_wJSNova_sidebarSelect"></seletct>');
			$.each(['base', 'black-tie', 'blitzer', 'cupertino', 'dot-luv', 'excite-bike', 'hot-sneaks', 'humanity', 'mint-choc', 'redmond', 'smoothness', 'south-street', 'start', 'swanky-purse', 'trontastic', 'ui-darkness', 'ui-lightness', 'vader'],
			function(index,version){ $this.jQueryUITheme.append('<option value="http://ajax.googleapis.com/ajax/libs/jqueryui/1.8/themes/' + version + '/jquery-ui.css">' + version + '</option>'); });

			$this.sidebar = 
			$('<div class="_wJSNova_sidebar"></div>')
			.append(
				$('<div class="_wJSNova_sidebarPadding"></div>')
				.append('<div class="_wJSNova_sidebarLabel">jQuery Version:</div>')
				.append($this.jQueryVersion)
				.append('<div class="_wJSNova_sidebarLabel">jQuery UI Version:</div>')
				.append($this.jQueryUIVersion)
				.append('<div class="_wJSNova_sidebarLabel">jQuery UI Theme:</div>')
				.append($this.jQueryUITheme)
			);

			/************************************************
			 * Code Area
			 ************************************************/
			$this.boxHTML = $('<textarea class="_wJSNova_boxEdit"></textarea>');
			$this.boxCSS = $('<textarea class="_wJSNova_boxEdit"></textarea>');
			$this.boxJS = $('<textarea class="_wJSNova_boxEdit"></textarea>');
			$this.boxResult = $('<iframe id="iframe" class="_wJSNova_boxEdit" frameBorder="0"></iframe>');
			
			$.each([$this.boxHTML, $this.boxCSS, $this.boxJS, $this.boxResult], function(index, item)
			{
				item
				.focus(function(){ $(this).parent().children('._wJSNova_boxLabel').fadeOut(); })
				.blur(function(){ $(this).parent().children('._wJSNova_boxLabel').fadeIn(); });
			});
			
			$this.codeArea = 
			$('<div class="_wJSNova_codeArea"></div>')
			.append(
				$('<table class="_wJSNova_codeAreaTable" cellpadding="0" cellspacing="1"></table>')
				.append(
					$('<tr></tr>')
					.append(
						$('<td class="_wJSNova_box _wJSNova_boxTop _wJSNova_boxLeft"></td>')
						.append(
							$('<div class="_wJSNova_boxContainer"></div>')
							.append($this.boxHTML)
							.append('<div class="_wJSNova_boxLabel">HTML</div>')	
						)
					)
					.append(
						$('<td class="_wJSNova_box _wJSNova_boxTop _wJSNova_boxRight"></td>')
						.append(
							$('<div class="_wJSNova_boxContainer"></div>')
							.append($this.boxCSS)
							.append('<div class="_wJSNova_boxLabel">CSS</div>')
						)
					)
				)
				.append(
					$('<tr></tr>')
					.append(
						$('<td class="_wJSNova_box _wJSNova_boxBottom _wJSNova_boxLeft"></td>')
						.append(
							$('<div class="_wJSNova_boxContainer"></div>')
							.append($this.boxJS)
							.append('<div class="_wJSNova_boxLabel">JavaScript</div>')
						)
					)
					.append(
						$('<td class="_wJSNova_box _wJSNova_boxBottom _wJSNova_boxRight"></td>')
						.append(
							$('<div class="_wJSNova_boxContainer"></div>')
							.append($this.boxResult)
							.append('<div class="_wJSNova_boxLabel">Result</div>')
						)
					)
				)
			)
			
			$this.jsn = 
			$('<div class="_wJSNova_holder"></div>')
			.append($this.menu)
			.append($this.sidebar)
			.append($this.codeArea);
			
			return $this.jsn;
		},
		
		run: function()
		{
			var html = this.boxHTML.val();
			var css = this.boxCSS.val();
			var js = this.boxJS.val();
			
			var jQuery = '<script type="text/javascript" src="' + this.jQueryVersion.val() + '"></script>';
			var jQueryUI = '<script type="text/javascript" src="' + this.jQueryUIVersion.val() + '"></script>';
			var jQueryUITheme = '<link rel="stylesheet" type="text/css" href="' + this.jQueryUITheme.val() + '"/>'
			
			var result = '<html><head>' + jQuery + jQueryUITheme + jQueryUI + '<style>' + css + '</style></head><body>' + html + '<script type="text/javascript">' + js + '</script></body></html>';
			
			this.writeResult(result);
		},
		
		reset: function()
		{
			this.boxHTML.val('');
			this.boxCSS.val('');
			this.boxJS.val('');
			this.writeResult('');
		},
		
		writeResult: function(result)
		{
			var iframe = this.boxResult[0];
		
			if(iframe.contentDocument) doc = iframe.contentDocument;
			else if(iframe.contentWindow) doc = iframe.contentWindow.document;
			else doc = iframe.document;
			
			doc.open();
			doc.writeln(result);
			doc.close();
		},
		
		resize: function()
		{
			var menuHeight = this.menu.outerHeight(true);
			var jsnHeight = this.jsn.outerHeight(true) - menuHeight;
			
			var codeAreaWidth = this.jsn.outerWidth(true) - this.sidebar.outerWidth(true);
			
			this.sidebar.css({top: menuHeight, height: jsnHeight});
			this.codeArea.css({top: menuHeight, height: jsnHeight, width: codeAreaWidth});
		}
	}
})(jQuery);