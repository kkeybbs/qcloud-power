# ����������--�����ҵ��ƶ˹��߼�
------
> �ճ������У��кܶ�С������Ϊ��ũ����ϲ���Լ���������С����������Ҳ��Ϊѧϰ��ʵ���ĺû��ᡣ
��ʹ��**��Ѷ��**�����У��ӻ����������С����Ĺ�˼��ǰ��˼�������ĥ��ѧϰ��ʹ�ã��ջ�ܴ�
������������ʹ�ҷ���

��˵˵������Щ���飨����Դ��ʵ��С���󣩣�
> * �ʾ�ϵͳ�����Google����֧���ı�����ѡ����ѡ����ҳ�Լ��ʾ�ĸ��ơ�����
> * ��ά�빤�߼���֧�����ɶ�ά�롢����/ɨ���ά�룬**΢��Ⱥ����ַ����**
> * ��ͼ�����������������ܱ߶��λ��
> * XCode dmg / docset���ص�ַ��ȡ

## 1.�����(php)
ʹ����**��Ѷ��**��65/�� �� ubuntu 14 x64������ʵ�ݣ��ʺ�Ͷ�����޵ĳ���ԳԳ��

�ҵ��ƶ˹��߼����ǻ��ں��php��ǰ��h5ʵ�֡�php���Ժ�apache��nginx����ʹ�á�
> ���úõ�ͬѧ��������
> ���������Ϻܶ࣬Ҳ���Ը����Լ���ϵͳ��ϲ���ķ�ʽ�����á������
�� ����CentOS�ο����http://blog.sina.com.cn/s/blog_505bf9af010137gf.html

apache2+php+mysql��װ�ǳ��򵥣�
```
sudo apt-get update
sudo apt-get install apache2 php5
service apache2 start
```
Ȼ����ϲ�� nginx + php ����ϣ�
```
# ��װ���µ�nginx��ģ�顢����ȫ���ο���http://nginx.org/en/linux_packages.html#stable
#  ����nginx�ٷ�key
wget http://nginx.org/keys/nginx_signing.key
sudo apt-key add nginx_signing.key
rm nginx_signing.key
#  ����nginx�ٷ�Դ
codename=$(lsb_release -a|grep Codename|awk '{print $2}')
echo deb http://nginx.org/packages/ubuntu/ $codename nginx > nginx.list
echo deb-src http://nginx.org/packages/ubuntu/ $codename nginx >> nginx.list
sudo cp nginx.list /etc/apt/sources.list.d/nginx.list
#  ��ʼ��װ��Ĭ���Ѿ�������û����service nginx start������
sudo apt-get update
sudo apt-get install nginx
#  ������װ����û��Ĭ��80�Ѿ�����
netstat -tln
#  ����޷����ʣ����Կ�����ȫ����û�м���80�� https://console.qcloud.com/cvm/securitygroup


# ��װphp�ͳ��ÿ⡣Ҳ��Ĭ�Ͼ��Ѿ���������û�о�����service php5-fpm����
sudo apt-get install php5-common php5-fpm php5-cli php5-curl php5-gd php5-sqlite php5-mcrypt

# nginxʹ���û���nginx�����У�php5-fpmʹ�á�www-data������
# nginx��Ȩ�޷���php5-fpm��sock��ͨ�ŵ�
# ���ԼӸ��飬����Ȩ����
sudo usermod -a -G www-data -G nginx  nginx

```
�޸�sudo vim /etc/nginx/conf.d/default.conf (�ٶ�����ŵ�/home/ubuntu/wwwĿ¼)
```
server {
    listen       80;
    server_name  localhost;
    root /home/ubuntu/www;
    index   index.php index.html index.htm;
    error_page   500 502 503 504  /50x.html;
    location = /50x.html {
        root /home/ubuntu/www;
    }
    location ~ \.php$ {
         try_files      $uri = 404;
         fastcgi_split_path_info ^(.+\.php)(/.+)$;
         fastcgi_pass   unix:/var/run/php5-fpm.sock;
         fastcgi_index  index.php;
         include        fastcgi_params;
         fastcgi_param  SCRIPT_FILENAME  $document_root$fastcgi_script_name;
    }
}
```
��ѡ������ `<?php` ��Ϊ `<?`
```
sed -i 's/short_open_tag = Off/short_open_tag = On/g' /etc/php5/fpm/php.ini
```
��������nginx��php5-fpm
```
sudo service php5-fpm restart
sudo service nginx restart
```
д��demoҳ�����`http://server ip/`����
```
echo "<? phpinfo(); ?>" > /home/ubuntu/www/index.php
```
## 2.�ʾ�ϵͳ
Google Docs�ı����ܺܰ���֧�ֺܶ������ͣ��ı��򡢵�ѡ����ѡ�����������񣬷�ҳ�ȣ�Ȼ����ǽ�ڲ����á�
����Ѷ�ʾ�http://wj.qq.com/����ǰ���Թ��ܶ������ʾ�ϵͳ������ӣ����������ʾ�ϵͳҲ������ô���ã����������Լ�д���ף�Ҳ��һ��ѧϰ�Ĺ��̡�
������д�Ĵ��룬�����֯��̫�ã��Ͳ���Դ��^_^������Ҫ�Ŀ�����ȥ������
> �ںܳ�һ��ʱ����������һ��������һֱ������������ռ���Ҳ˵���������������PM�������µ�����������

**ǰ��**����Google��������ǰ��js���룬��������
**��̨**��php���ռ���Ԫ�ص�json���洢����װ�ʾ�ҳ�棻�ʾ�ش�Ĵ洢������



## 3.��ά�빤��
## 4.��ͼ����
## 5.XCode dmg / docset���ص�ַ��ȡ

