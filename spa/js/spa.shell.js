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
            chat_retract_title  :  'Click to extend'
    },
    stateMap = {$container : null, is_chat_retracted : true},//首先是收回来的
    jQueryMap = {},
    setJqueryMap, initModule, toggleChat, onClickChart;
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
      toggleChat(stateMap.is_chat_retracted);
      return false;
    };

    initModule = function( $container ){
        stateMap.$container = $container;
        $container.html(configMap.main_html);
        setJqueryMap();
        stateMap.is_chat_retracted = true;
        jQueryMap.$chat.attr('title', configMap.chat_retract_title).click( onClickChart );
    };
    return { initModule : initModule };
}());