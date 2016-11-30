var Route = ReactRouter.Route,
    DefaultRoute = ReactRouter.DefaultRoute;

var AppRoutes = (
  <Route handler={App}>
    <DefaultRoute handler={Welcome} />
    <Route handler={Login} path='login' />
    <Route handler={Logout} path='logout' />

    <Route handler={UserShow} path='user/:user_id' />
  </Route>
);