# widgetfactory

## database design 

![alt text](https://www.dropbox.com/s/5mqqtusvxmvemk1/Screenshot%202016-12-05%2023.55.17.png?raw=1 "Database schema")

## api

The app is driven by a simple RESTful API with a url scheme of /object/identifier/sub-object. For example, to the get the "possible attributes" for a particular widget type the url is /widgettype/1/attributes. When deleting an entity, an HTTP delete is issued, when updating particular values of an object, an HTTP patch isssue.

The app is written in node.js and is asychronous, using promises to orchestrate the actions. Database interaction is done using sequelize.js, a simple and powerful ORM tool.

## ui

The UI is written in knockout.js, my first time using it, so any constructive criticism is welcome.

## Shortcomings

* controllers are performing more work than they should
* database design makes certain checks expensive
* knockout.js newbie here, probably a lot of optimizations
* not tests :(
