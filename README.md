# 激发云力量--打造我的云端工具集
------
> 日常工作中，有很多小需求，作为码农，总喜欢自己动手做点小东西出来，也成为学习与实践的好机会。
在使用**腾讯云**过程中，从环境搭建、各个小需求的构思，前后端技术的琢磨、学习、使用，收获很大。
现在整理出来和大家分享。

先说说做了哪些事情（都来源于实际小需求）：
> * 问卷系统：借鉴Google表单，支持文本、单选、多选、分页以及问卷的复制、导出
> * 二维码工具集：支持生成二维码、解析/扫描二维码，**微信群短网址生成**
> * 地图搜索：按中心搜索周边多个位置
> * XCode dmg / docset下载地址获取

## 1.环境搭建(php)
使用了**腾讯云**￥65/月 的 ubuntu 14 x64，经济实惠，适合投入有限的程序猿猿。

我的云端工具集都是基于后端php、前端h5实现。php可以和apache或nginx配套使用。
> 配置好的同学可以跳过
> 网络上资料很多，也可以根据自己的系统、喜欢的方式来配置、搭建环境
》 例如CentOS参考这里：http://blog.sina.com.cn/s/blog_505bf9af010137gf.html

apache2+php+mysql安装非常简单：
```
sudo apt-get update
sudo apt-get install apache2 php5
service apache2 start
```
然而更喜欢 nginx + php 的组合：
```
# 安装最新的nginx，模块、功能全。参考：http://nginx.org/en/linux_packages.html#stable
#  加入nginx官方key
wget http://nginx.org/keys/nginx_signing.key
sudo apt-key add nginx_signing.key
rm nginx_signing.key
#  加入nginx官方源
codename=$(lsb_release -a|grep Codename|awk '{print $2}')
echo deb http://nginx.org/packages/ubuntu/ $codename nginx > nginx.list
echo deb-src http://nginx.org/packages/ubuntu/ $codename nginx >> nginx.list
sudo cp nginx.list /etc/apt/sources.list.d/nginx.list
#  开始安装，默认已经开启，没开就service nginx start开启下
sudo apt-get update
sudo apt-get install nginx
#  看看安装好了没，默认80已经开啦
netstat -tln
#  如果无法访问，可以看看安全组有没有加上80： https://console.qcloud.com/cvm/securitygroup


# 安装php和常用库。也是默认就已经开启啦，没有就运行service php5-fpm开启
sudo apt-get install php5-common php5-fpm php5-cli php5-curl php5-gd php5-sqlite php5-mcrypt

# nginx使用用户“nginx”运行，php5-fpm使用“www-data”运行
# nginx无权限访问php5-fpm的sock来通信的
# 所以加个组，就有权限啦
sudo usermod -a -G www-data -G nginx  nginx

```
修改sudo vim /etc/nginx/conf.d/default.conf (假定代码放到/home/ubuntu/www目录)
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
可选：允许 `<?php` 简化为 `<?`
```
sed -i 's/short_open_tag = Off/short_open_tag = On/g' /etc/php5/fpm/php.ini
```
重新启动nginx、php5-fpm
```
sudo service php5-fpm restart
sudo service nginx restart
```
写个demo页面访问`http://server ip/`看看
```
echo "<? phpinfo(); ?>" > /home/ubuntu/www/index.php
```
## 2.问卷系统
Google Docs的表单功能很棒，支持很多种类型：文本框、单选、多选、下拉框、网格，分页等，然而在墙内不可用。
在腾讯问卷http://wj.qq.com/出来前，试过很多其他问卷系统，搭建复杂；第三方的问卷系统也不是那么好用，于是早先自己写了套，也是一个学习的过程。
（老早写的代码，风格、组织不太好，就不开源了^_^，有需要的可以拿去看看）
> 在很长一段时间里，大家中午一起订外卖。一直用这个东西来收集大家菜单，轮流担任外卖PM，负责下单、拿外卖。

**前端**：从Google表单分离了前端js代码，略作调整
**后台**：php来收集表单元素的json，存储；组装问卷页面；问卷回答的存储和下载



## 3.二维码工具
## 4.地图搜索
## 5.XCode dmg / docset下载地址获取

