var douban = require('../lib/douban');

douban.music_info('4744841', function(error, data){
    console.log(data);
});

douban.music_tags('4744841', function(error, data){
    console.log(data);
});

douban.user_info('wong2', function(error, data){
    console.log(data);
});
