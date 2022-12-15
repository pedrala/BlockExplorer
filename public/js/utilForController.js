module.exports.leftZeroDelet = (string) => {
    return string.replace(/(^0+)/, ""); //
}
module.exports.CheckMaxString = (obj, maxNum) => {
    var li_str_len = obj.length;
    var li_byte = 0;
    var li_len = 0;
    var ls_one_char = "";
    var ls_str2 = "";
    for (var j = 0; j < li_str_len; j++) {
        ls_one_char = obj.charAt(j);
        if (escape(ls_one_char).length > 4) {
            li_byte += 2;
        } else {
            li_byte++;
        }
        if (li_byte <= maxNum) {
            li_len = j + 1;
        }
    }
    if (li_byte > maxNum) {
        ls_str2 = obj.substr(0, li_len) + "...";
    } else {
        ls_str2 = obj;
    }
    return ls_str2;
}

/* 
    'AAAA...BB', 4
    'AAAAAA...BBB', 6
    'AAAAAAAA...BBBB', 8
    'AAAAAAAAAA...BBBBB', 10
    'AAAAAAAAAAAA...BBBBBB', 12
*/
module.exports.ShortenStringFormat = (obj, firstlength) => {
    let li_str_len = obj.length;       
    let ls_str = "";

    if (firstlength == 4) {
        ls_str = obj.substr(0, 4) + "..." + obj.substr(li_str_len-2, 2);
    } else if (firstlength == 6){
        ls_str = obj.substr(0, 6) + "..." + obj.substr(li_str_len-3, 3);
    } else if (firstlength == 8){
        ls_str = obj.substr(0, 8) + "..." + obj.substr(li_str_len-4, 4);
    } else if (firstlength == 10){
        ls_str = obj.substr(0, 10) + "..." + obj.substr(li_str_len-5, 5);
    } else if (firstlength == 12){
        ls_str = obj.substr(0, 12) + "..." + obj.substr(li_str_len-6, 6);
    }
    
    return ls_str;
}

//hexa to decimal
function h2d(s) {
    function add(x, y) {
        var c = 0, r = [];
        var x = x.split('').map(Number);
        var y = y.split('').map(Number);
        while (x.length || y.length) {
            var s = (x.pop() || 0) + (y.pop() || 0) + c;
            r.unshift(s < 10 ? s : s - 10);
            c = s < 10 ? 0 : 1;
        }
        if (c) r.unshift(c);
        return r.join('');
    }

    var dec = '0';
    s.split('').forEach(function (chr) {
        var n = parseInt(chr, 16);
        for (var t = 8; t; t >>= 1) {
            dec = add(dec, dec);
            if (n & t) dec = add(dec, '1');
        }
    });
    return dec;
}

const bpInfo =
     [
        {
            "subnet_id": 1,
            "hub_code": 1,
            "name": "Mercury",
            "latitude": "37.63343",
            "longitude": "127.03324",
            "country": "KR",
            "city": "Seoul",
            "hub_p2p_addr": "0x253f7f036004"
        },
        {
            "subnet_id": 1,
            "hub_code": 2,
            "name": "Venus",
            "latitude": "37.53323",
            "longitude": "126.87421",
            "country": "KR",
            "city": "Seoul",
            "hub_p2p_addr": "0x25357e576008"
        },
        {
            "subnet_id": 1,
            "hub_code": 3,
            "name": "Mars",
            "latitude": "37.41434",
            "longitude": "127.12423",
            "country": "KR",
            "city": "Seongnam-si",
            "hub_p2p_addr": "0x25297f0c600c"
        },
        {
            "subnet_id": 1,
            "hub_code": 4,
            "name": "Jupiter",
            "latitude": "37.50529",
            "longitude": "126.34353",
            "country": "KR",
            "city": "Incheon",
            "hub_p2p_addr": "0x25337e226010"
        },
        {
            "subnet_id": 1,
            "hub_code": 5,
            "name": "Saturn",
            "latitude": "37.52614",
            "longitude": "127.74393",
            "country": "KR",
            "city": "Yangpyeong-gun",
            "hub_p2p_addr": "0x25357f4a6014"
        },
        {
            "subnet_id": 1,
            "hub_code": 6,
            "name": "Uranus",
            "latitude": "37.52208",
            "longitude": "126.23443",
            "country": "KR",
            "city": "Ongjin-gun",
            "hub_p2p_addr": "0x25347e176018"
        },
        {
            "subnet_id": 1,
            "hub_code": 7,
            "name": "Neptune",
            "latitude": "37.51205",
            "longitude": "127.54543",
            "country": "KR",
            "city": "Yangpyeong-gun",
            "hub_p2p_addr": "0x25337f37601c"
        }
    ];
    
module.exports.bpInfoLength = bpInfo.length;

//get Subnet Name from Subnet Id
module.exports.getBpName = (subnetId) => {     
    //console.log("🚀 ~ file: utilForController.js ~ line 108 ~ bpList", JSON.stringify(global.bpList))
    let result = '';

    bpInfo.forEach(function (value, index, array) {
        //console.log("🚀 ~ file: utilForController.js ~ line 88 ~ hub_p2p_addr", value)

        let li_str_len = value.hub_p2p_addr.length;
        //hub_p2p_addr 의 끝 4자리 잘라온다
        let hub_p2p_addr = value.hub_p2p_addr.substr(li_str_len - 4, 4);
        //4자리 숫자를 Hexa 로 변환한 값이 BP 와 같으면 BP 명을 가져옴
        if (h2d(hub_p2p_addr) == subnetId)
        {
            result = value.name
            // console.log("hub_p2p_addr"+h2d(hub_p2p_addr));
            // console.log("name:"+result);
        }
    });

    return result   
   
}