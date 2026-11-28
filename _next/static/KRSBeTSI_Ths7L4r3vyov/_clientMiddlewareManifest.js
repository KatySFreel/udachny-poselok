self.__MIDDLEWARE_MATCHERS = [
  {
    "regexp": "^\\/udachny-poselok(?:\\/(_next\\/data\\/[^/]{1,}))?(?:\\/((?!_next|admin-media|images|icons|.*\\.[a-zA-Z0-9]+$).*))(\\.json|\\.rsc|\\.segments\\/.+\\.segment\\.rsc)?[\\/#\\?]?$",
    "originalSource": "/((?!_next|admin-media|images|icons|.*\\.[a-zA-Z0-9]+$).*)"
  }
];self.__MIDDLEWARE_MATCHERS_CB && self.__MIDDLEWARE_MATCHERS_CB()