bevy
=======

built on node.js and express
using fluxbone + react for templating

to use:

(need mongodb, node, and git first)

```javascript
git clone git@github.com:blahoink/bevy
npm install --verbose
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
