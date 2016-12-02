var Route = ReactRouter.Route,
    DefaultRoute = ReactRouter.DefaultRoute;

var AppRoutes = (
  <Route handler={App}>
    <DefaultRoute handler={Welcome} />
    <Route handler={Login} path='login' />
    <Route handler={Logout} path='logout' />
    <Route handler={CreateUser} path='sign_up' />

    <Route handler={ShowUser} path='dashboard' />
    <Route handler={ManageUsers} path='users' />
    <Route handler={CreateUser} path='users/new' />
    <Route handler={ShowUser} path='users/:userID' />
    <Route handler={EditUser} path='users/:userID/edit' />

    <Route handler={CreateMeal} path='users/:userID/meals/new' />
    <Route handler={EditMeal} path='users/:userID/meals/:mealID/edit' />
  </Route>
);