const {listItemTests} = require("./ListItemsTests");

listItemTests('VirtualList', null, 'virtualList', 'virtualList', 'VirtualList');
listItemTests(`VirtualList`, 100, 'virtualList', 'virtualList', 'VirtualList100Items');
