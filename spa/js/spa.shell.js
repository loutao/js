spa.shell = (function () {
    var configMap = {
            main_html: String()
            + '<div class="spa-shell-head">' +
                '<div class="spa-shell-head-logo"></div>' +
                '<div class="spa-shell-head-acct"></div>' +
                '<div class="spa-shell-head-search"></div>' +
              '</div>' +
              '<div class="spa-shell-main">' +
                '<div class="spa-shell-main-nav"></div>' +
                '<div class="spa-shell-main-content"></div>' +
              '</div>' +
              '<div class="spa-shell-foot"></div>' +
              '<div class="spa-shell-chat"></div>' +
              '<div class="spa-shell-modal"></div>',
            chat_extend_time    :  1000,
            chat_retract_time   :  300,
            chat_extend_height  :  450,
            chat_retract_height :  15,
            chat_extended_title :  'Click to retract',
            chat_retract_title  :  'Click to extend',
            anchor_schame_map   :  {
                chat : {open : true, closed : true}
            }

    },
    stateMap = {$container : null, is_chat_retracted : true,
        anchor_map : {}
    },//首先是收回来的
    jQueryMap = {},
    //此处申明一些方法
    setJqueryMap, initModule, toggleChat, onClickChart,
    copyAnchorMap, changeAnchorPart, onHashChange;

    copyAnchorMap = function(){
      return $.extend(true, {}, stateMap.anchor_map);
    };

    //Purpose: 改变部分的锚URI
    //Arguments: arg_map 描述了URI的什么部分需要被改变
    //Returns: boolean
    //  * true  uri部分被改变了
    //  * false uri部分改变没成功
    //Action:
    //  目前的锚存储在stateMap.anchor_map中
    //  This method:
    //      * 使用copyAnchorMap创建了map的复本
    //      * 使用arg_map修改key-values
    //      * 试图使用uriAnchor改变uri
    //      * 成功返回true, 失败返回false
    changeAnchorPart = function(arg_map){
        var
            anchor_map_reivse = copyAnchorMap(),
            boolean_return = true,
            key_name, key_name_dep
        //开始归并change进arg_map
        KEYVAL:
            for(key_name in arg_map){
                if(arg_map.hasOwnProperty(key_name)){
                    if(key_name.indexOf('_') === 0){
                        continue KEYVAL;
                    }
                    anchor_map_reivse[key_name] = arg_map[key_name];

                    key_name_dep = '_'+key_name;
                    if(arg_map[key_name_dep]){
                        anchor_map_reivse[key_name_dep] = arg_map[key_name_dep];
                    }
                    else{
                        delete anchor_map_reivse[key_name_dep];
                        delete anchor_map_reivse['_s' + key_name_dep];
                    }
                }
            }

        //开始更新uri, 如果出错则进行回滚
        try{
            $.uriAnchor.setAnchor(anchor_map_reivse)
        }catch( error ){
            //利用现有的state中的状态替换uri
            $.uriAnchor.setAnchor(stateMap.anchor_map, null, true);
            boolean_return = false;
        }
        return boolean_return;
    };

    //Purpose: 处理HashChange event
    //Arguments:
    //  * event - jq event object
    //Setting : none
    //Returns : false
    //Action  :
    //  * 解析uri锚
    //  * 比较期望的应用状态和现在的应用状态
    onHashChange = function(event){
        var
            anchor_map_previous = copyAnchorMap(),
            anchor_map_proposed,
            _s_chat_previous, _s_chat_proposed,
            s_chat_proposed;
        try{
            anchor_map_proposed = $.uriAnchor.makeAnchorMap();
        }catch( error ){
            $.uriAnchor.setAnchor(anchor_map_previous, null, true);
            return false;
        }
        stateMap.anchor_map = anchor_map_proposed;
        _s_chat_previous = anchor_map_previous._s_chat;
        _s_chat_proposed = anchor_map_proposed._s_chat;
        if(!anchor_map_previous || _s_chat_previous != _s_chat_proposed){
            s_chat_proposed = anchor_map_proposed.chat;
            switch(s_chat_proposed){
                case 'open' :
                    toggleChat(true);
                break;
                case 'closed' :
                    toggleChat(false);
                break;
                default :
                    toggleChat(false);
                    delete anchor_map_proposed.chat;
                    $.uriAnchor.setAnchor(anchor_map_proposed, null, true);
            }

        }
        return false;
    }


    setJqueryMap = function(){
      var $container = stateMap.$container;
      jQueryMap = {$container : $container, $chat: $container.find('.spa-shell-chat')};

    };
    toggleChat = function(do_extend, callback){
        var
            px_chat_ht = jQueryMap.$chat.height(),
            is_open    = px_chat_ht === configMap.chat_extend_height,
            is_closed  = px_chat_ht === configMap.chat_retract_height,
            is_sliding = !is_open && !is_closed;
        if(is_sliding) return false;
        if(do_extend){
            jQueryMap.$chat.animate(
                {height : configMap.chat_extend_height},
                configMap.chat_extend_time,
                function(){
                    jQueryMap.$chat.attr('title', configMap.chat_extended_title);
                    stateMap.is_chat_retracted = false;  //把状态改成展开
                    if(callback){
                        callback(jQueryMap.$chat);
                    }
                }
            );
            return true;
        }
        jQueryMap.$chat.animate(
            {height : configMap.chat_retract_height},
            configMap.chat_retract_time,
            function(){
                stateMap.is_chat_retracted = true;
                if(callback){
                    callback(jQueryMap.$chat);
                }
            }
        );
        return true;
    };

    onClickChart = function(){
        changeAnchorPart({
            chat: (stateMap.is_chat_retracted ? 'open' : 'closed')
        });
      return false;
    };

    initModule = function( $container ){
        stateMap.$container = $container;
        $container.html(configMap.main_html);
        setJqueryMap();
        stateMap.is_chat_retracted = true;
        jQueryMap.$chat.attr('title', configMap.chat_retract_title).click( onClickChart );
        $.uriAnchor.configModule({
            schema_map : configMap.anchor_schame_map
        });
        $(window)
            .bind('hashchange', onHashChange)
            .trigger('hashchange');
    };
    return { initModule : initModule };
}());