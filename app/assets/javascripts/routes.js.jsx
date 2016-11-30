var Route = ReactRouter.Route,
    DefaultRoute = ReactRouter.DefaultRoute;

var AppRoutes = (
  <Route handler={App}>
    <DefaultRoute handler={Welcome} />
    <Route handler={Login} path='login' />
    <Route handler={Logout} path='logout' />

    <Route handler={Dashboard} path='dashboard' />

    <Route handler={CreateMeal} path='user/:userID/meals/new' />
  </Route>
);