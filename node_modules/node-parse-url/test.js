var url = require('./index');
var assert = require('assert');

console.log('https://www.github.com/ : host `github` =>', url('https://www.github.com/').host === 'github');
console.log('www.twitter.com : domain `twitter.com` =>', url('www.twitter.com').domain === 'twitter.com');
console.log('twitter.com : subdomain `null` =>', url('twitter.com').subdomain === null);
console.log('www.twitter.com : subdomain `www` =>', url('www.twitter.com').subdomain === null);

console.log(url('https://github.com/aredo'));
