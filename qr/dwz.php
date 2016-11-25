<?

if(!isset($_POST['url'])) {
    exit;
}

$url = $_POST['url'];
$url = urlencode($url);

$app_key = 3271760578;
$url = "http://api.t.sina.com.cn/short_url/shorten.json?source=$app_key&url_long=$url";

$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, $url);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
# curl_setopt($ch, CURLOPT_POST, 1);
# curl_setopt($ch, CURLOPT_POSTFIELDS, array('url'=>$url));
$result = curl_exec($ch);
curl_close($ch);
$result = json_decode($result, true);
if(isset($result['error'])) {
    echo "${result['error']}, ${result['error_code']}";
} else {
    echo $result[0]['url_short'];
}