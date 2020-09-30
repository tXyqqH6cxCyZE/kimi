class xbox {
  include config
  # 配置文件必须放置在resinhome/conf下
  #修改用户目录的权限
  file { [ "/home/work/bin/",
           "/home/work/bin/kingmi/",
           "/home/work/bin/kingmi/${config::prog_name}/" ]:
    ensure => directory,
    mode => 755, owner => work, group => work,
  }
  #创建日志路径
  file { [ "/home/work/log/",
           "/home/work/log/kingmi/",
           "/home/work/log/kingmi/${config::prog_name}/" ]:
    ensure => directory,
    mode => 755, owner => work, group => work,
  } ->
  exec { 'chown -R work:work /home/work/log/kingmi/${config::prog_name}/' :
    path => '/bin/:/usr/bin/'
  }

}

include xbox
