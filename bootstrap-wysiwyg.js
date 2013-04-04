/*!
 * Bootstrap Wysiwyg Rich Text Editor v1.0
 * https://github.com/mindmup/bootstrap-wysiwyg
 *
 * Copyright 2013, Gojko Adzic, Damjan Vujnovic, David de Florinier 
 * Licensed under the MIT license.
 * https://github.com/mindmup/bootstrap-wysiwyg/LICENSE
 *
 */
/*global $*/
/*jslint browser:true*/
$.fn.wysiwyg = function (options) {
	'use strict';
	var editor = this,
		selectedRange,
		defaultOptions = {
			hotKeys: {
				'ctrl+b meta+b': 'bold',
				'ctrl+i meta+i': 'italic',
				'ctrl+u meta+u': 'underline',
				'ctrl+z meta+z': 'undo',
				'ctrl+y meta+y meta+shift+z': 'redo'
            },
			toolbarRole: 'editor-toolbar',
			commandRole: 'edit'
		},
		execCommand = function (command) {
			document.execCommand(command, 0);
		},
		bindHotkeys = function (hotKeys) {
			$.each(hotKeys, function (hotkey, command) {
				editor.keydown(hotkey, function (e) {
					e.preventDefault();
					e.stopPropagation();
					execCommand(command);
				}).keyup(hotkey, function (e) {
					e.preventDefault();
					e.stopPropagation();
				});
			});
		},
		saveSelectionRange = function () {
			var sel = window.getSelection();
			if (sel.getRangeAt && sel.rangeCount) {
				selectedRange = sel.getRangeAt(0);
			}
		},
		restoreSelectionRange = function () {
			var selection = window.getSelection();
			if (selectedRange) {
				selection.removeAllRanges();
				selection.addRange(selectedRange);
			}
		},
		bindToolbar = function (toolbar, options) {
			var target = $(toolbar.data('target'));
			toolbar.find('[data-' + options.commandRole + ']').click(function () {
				restoreSelectionRange();
				execCommand($(this).data(options.commandRole));
				saveSelectionRange();
			});
		};
	options = $.extend({}, defaultOptions, options);
	bindHotkeys(options.hotKeys);
	$.each($.find('[data-role=' + options.toolbarRole + ']'), function () { bindToolbar($(this), options); });
	$.each(this, function () {
		var before,
			element = $(this);
		element.attr('contenteditable', true)
			.on('focus', function () {
				before = element.html();
			})
			.on('mouseup keyup mouseout', saveSelectionRange)
			.on('input blur keyup paste', function () {
				if (before !== element.html()) {
					before = element.html();
					element.trigger('change');
				}
			});
	});
	return this;
}
