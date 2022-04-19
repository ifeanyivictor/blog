import React from "react";
import { BrowserRouter, Route } from "react-router-dom";

import StoryDetail from "./screens/storyDetail/StoryDetail";

import BlogPost from "./admin/write/BlogPost";
import BlogList from "./admin/blog/BlogList";
import { StoryFront } from "./screens/home/StoryFront";
import SignIn from "./screens/signIn/SignIn";
import Register from "./screens/register/Register";

export default function App() {
  return (
    <div>
      <BrowserRouter>
        <Route path="/" component={StoryFront} exact></Route>
        <Route path="/story-detail/:id" component={StoryDetail} exact></Route>
        <Route path="/sign-in" component={SignIn} exact></Route>
        <Route path="/register" component={Register} exact></Route>
        <Route path="/admin" component={BlogList} exact></Route>
        <Route
          path="/list-blog/:id/blog-new"
          component={BlogPost}
          exact
        ></Route>
      </BrowserRouter>
    </div>
  );
}
