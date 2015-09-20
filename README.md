bevy
=======

built on node.js and express
using fluxbone + react for templating

to use:

(need mongodb, node, python 2.7.X, and git first)

```javascript
git clone https://github.com/blahoink/bevy.git
npm install --verbose
npm install -g gulp
gulp build
gulp serve
```
go to http://localhost:80

it's that easy

recommendations:
----------------

- setup mongodb as a service (if on windows)
that way you won't have to leave mongod always running in a shell

- edit your hosts file so you can access local site from http://bevy.dev
	- linux: /etc/hosts
	- windows: C:\Windows\System32\drivers\etc\hosts (need admin privileges)
add:
```
127.0.0.1 bevy.dev
127.0.0.1 api.bevy.dev
```

known issues:
-------------

- our notification service, mubsub, sometimes needs a dummy document
in the notification collection to run properly. if mubsub is yelling
at you, then just insert anything into the collection and it should
fix itself
