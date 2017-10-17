/**
 *
 */
var path = require('path')

window.onload = function (e) {
    console.log("window loaded!");
    console.log(e);

    const root = {
      name: 'root',
      children: [
        {
          name: 'child #1',
          children: []
        },
        {
          name: 'child #2',
          children: [
            {
              name: 'option 1',
              children: []
            },
            {
              name: 'option 2',
              children: []
            }
          ]
        }
      ]
    };
    // const root = {
    //   name: 'foo',
    //   children: [{
    //     name: 'bar',
    //     children: [{
    //       name: 'bar',
    //       children: []
    //     }, {
    //       name: 'baz',
    //       children: []
    //     }]], {
    //     name: 'spoo',
    //     children: [{
    //       name: 'spoon'
    //     }, {
    //       name: 'goon'
    //     }]
    //   }
    // }

    const tree = require('electron-tree-view')({
      root,
      container: document.getElementById('work-div'),
      children: c => c.children,
      label: (c) =>  { return 'FUNNY ' + c.name }
    })

    // tree.on('selected', item => {
    //   // adding a new children to every selected item
    //   item.children.push({ name: 'foo', children: [] })

    //   tree.loop.update({ root })

    //   console.log('item selected')
    // })
}