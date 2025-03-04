import type { Route } from "./+types/home";
import MovieList from "components/MovieList";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "FilmeDicas" },
    { name: "description", content: "Welcome to React Router!" }
  ];
}

export default function Home() {
  return (
    <div>
      {/* <Helmet>
        <title>
          <PiPopcornDuotone /> FilmeDicas
        </title>
      </Helmet> */}
      <MovieList />
    </div>
  );
}
