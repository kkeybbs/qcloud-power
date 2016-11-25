<?
include('CFPropertyList/CFPropertyList.php');

function curl_download($url, $timeout=10) {
	$userAgent = 'Mozilla/5.0 (Windows; U; Windows NT 5.1; en-US; rv:1.8.1.13) Gecko/20080311 Firefox/2.0.0.13';
	$ch = curl_init();
	curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, FALSE);
	curl_setopt($ch, CURLOPT_FOLLOWLOCATION, true);
	curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
	curl_setopt($ch, CURLOPT_HEADER, true);
	curl_setopt($ch, CURLOPT_URL, $url);
	curl_setopt($ch, CURLOPT_TIMEOUT, $timeout);
	curl_setopt($ch, CURLOPT_USERAGENT, $userAgent);
	# curl_setopt($ch, CURLOPT_HTTPHEADER, $header);
	$data = curl_exec($ch);
	list($header, $data) = explode("\r\n\r\n", $data);
	$http_code = curl_getinfo($ch, CURLINFO_HTTP_CODE);
	curl_close($ch);
	return $data;
}

function create_table($item) {
	$userinfo = $item['userInfo'];
	if(!isset($item['fileSize'])) {
		$item['fileSize'] = 0;
	} else {
		$item['fileSize'] = round($item['fileSize']/ 1000 / 1000, 2);
	}
	$table = "<table class=\"item\">";
	$table .= "<tr><td width=\"100px\">Name</td><td><strong>{$item['name']}</strong> <a href=\"{$item['source']}\" target=\"_blank\">download</a></td></tr>";
	$table .= "<tr><td>Size</td><td>{$item['fileSize']} MB</td></tr>";
	$table .= "<tr><td>Version</td><td>{$item['version']}</td></tr>";
	$table .= "<tr><td>ID</td><td>{$item['identifier']}</td></tr>";
	$item = $item['userInfo'];
	$table .= "<tr><td>Predicate</td><td>{$item['ActivationPredicate']}</td></tr>";
	$table .= "<tr><td>Category</td><td>{$item['Category']}</td></tr>";
	$table .= "<tr><td>Install</td><td>{$item['InstallPrefix']}</td></tr>";
	$table .= "<tr><td>ADC Auth</td><td>".($item['RequiresADCAuthentication'] ? 'true' : 'false')."</td></tr>";
	$table .= "<tr><td>Summary</td><td>{$item['Summary']}</td></tr>";
	$table .= "</table>";
	return $table;
}

function download() {
	$file_xml = 'xcode.xml';
	$url = 'https://developer.apple.com/library/downloads/docset-index.dvtdownloadableindex';
	if(!file_exists($file_xml)) {
		$xml = curl_download($url);
		file_put_contents($file_xml, $xml);
	} else {
		$xml = file_get_contents($file_xml);		
	}

	$plist = new CFPropertyList\CFPropertyList();
	$plist->parse($xml);
	$docs = $plist->toArray();
	/*
	$p = xml_parser_create();
	xml_parse_into_struct($p, $xml, $vals, $index);
	xml_parser_free($p);
	$p = json_encode($vals);
	file_put_contents('xcode.json', json_encode($vals));
	*/
	$docs['downloadables'] = array_reverse($docs['downloadables']);
	file_put_contents('xcode.json', json_encode($docs));
	$rows = '';
	foreach($docs['downloadables'] as $item) {
		$rows .= create_table($item);
	}
	$html = file_get_contents('index.tpl.html');
	$html = str_replace('#rows#', $rows, $html);
	return $html;
}

$today = date('Y-m-d');
$file_html = "html_$today.html";
if(!file_exists($file_html)) {
	$html = download();
	file_put_contents($file_html, $html);
} else {
	$html = file_get_contents($file_html);
}

header("Content-type: text/html; charset=utf-8");
echo $html;
