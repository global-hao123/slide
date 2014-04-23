/**
 *
 * Author: songyaru | songyaru9@gmail.com
 * Date: 14-1-16  下午12:44
 *
 */
(function ($) {
    var pluginName = "slide";
    var plugin = $[pluginName];
    var pluginImpl = {
        options: {
            pagination: {
                elem: ".pagination", //包含pagination的父节点 jQuery选择器或者dom元素 $(opts.elem)
                child: "li", //所有pagination节点  jQuery选择器或者dom元素  $(opts.child, 父节点)
                currentClass: "cur", //当前显示的pagination添加的className
                type: "click"//["click"|"mousemove"] pagination父节点上冒泡监听的事件类型
            }
        },
        paginationChange: function (data) {
            this.currentPagination.removeClass(this.options.pagination.currentClass);
            this._setCurrentPagination(data.index);

        },
        _getPagination: function (index) {
            return this.paginations.eq(index);
        },
        _setCurrentPagination: function (i) {
            this.currentPagination = this._getPagination(i);
            this.currentPagination.addClass(this.options.pagination.currentClass);
        },

        _updatePagination: function (options) {
            var opts = options.pagination;
            this.paginations = $(opts.child, $(opts.elem));
        },
        _createPagination: function (options) {
            this._updateFnArray.push(this._updatePagination); //更新pagination
            var _this = this;
            var opts = options.pagination;
            var ret = $(opts.elem);
            this._updatePagination(options);
            this._setCurrentPagination(this.index);

            ret.on(opts.type, opts.child, function () {
                var i = _this.paginations.index(this);
                _this.jump(i);
            });

            this.element.on("ui_jump", function (e, data) {
                _this.paginationChange(data);
                return false; //不要冒泡，防止组件套组件的时候，子组件消息传递到父组件
            });

            return ret;
        }
    };
    plugin._extend(pluginImpl);

})(jQuery);
