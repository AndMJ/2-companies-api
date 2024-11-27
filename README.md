### (I will be doing this a little bit differently, like it's done [here](https://github.com/ptv1p3r/ptm_api/tree/master/api), using the MVC principle)

## Assignment 2: Project - Restructuring our FareWheels App

### Instructions:

I want you to refactor our FareWheels application and move all the routes inside a new folder called routes. There you should have a file called companies.js. So move all the routes there, add them to a router object, export the router, and then import it into index.js.

1. First, add a new folder called routes.

2. Inside this folder, add a new file, companies.js

3. Move all the code for working with companies into our new module (starting from our companies array all the way to the end of this validateCompany function).

4. On the top, load the Express module and store it in a constant called express.

5. From this express variable, set the Router. Store it in a constant called router.

6. Rename all the app object to router.

7. Simplify the routes and get rid of api/companies.

8. At the end of this file, export this router.

9. Now, import this router in the index module.

10. Finally, call app.use, pass the arguments for any routes that start with /api/companies and companies router.