function blackList(list, reason = 'Website Blocked') {
  return (ctx) => {
    if(list.indexOf(new URL(ctx.url).hostname)>-1) {
      ctx.response.end(reason)
    }
  }
}

function force(ctx) {
  return ctx.url.replace(/http:\/\//g, 'https://');
}

if (!typeof module !== undefined) module.exports.blackList = blackList;
if (typeof module !== undefined) module.exports.force = force;