function blackList(list, reason = 'Website Blocked') {
  return (ctx) => {
    console.log(list.indexOf(new URL(ctx.url).hostname))
    if(list.indexOf(new URL(ctx.url).hostname)>-1) {
      res.end(reason)
    }
  }
}

function force(ctx) {
  return ctx.url.replace(/http:\/\//g, 'https://');
}

if (!typeof module !== undefined) module.exports.blackList = blackList;
if (typeof module !== undefined) module.exports.force = force;