
import { useQuery } from '@apollo/client';
import gql from 'graphql-tag';
import { useEffect, useState } from 'react';
const ALL_POSTS = gql`
  query ALL_POST {
    posts {
      id
      content {
        document
      }
      title
      author {
        id
        name
      }
    }
  }
`;

export default function Posts () {
  const { data, loading, error } = useQuery(ALL_POSTS);
  console.log({data, loading, error})
  const posts = data?.posts;
  const [hydrate, setHydrate] = useState(false);

  if (loading) return <div>loading ...</div>
  if (error) return <div>Error: {error.message}</div>

  // find the latest publishedDate post
  const _latestPost = posts.slice(-4).reduce((a, b) => {
    return new Date(a.publishDate) > new Date(b.publishDate) ? a : b;
  });

  useEffect(() => {

    setHydrate(true);

  }, [hydrate]);
  if (!hydrate) {
    // Returns null on first render, so the client and server match
    return null;
  }
  return (
    <div className="relative">
      {
        posts.map((post) => (
          <div key={post.id}>
            <h1>{post.title}</h1>
          </div>
        ))
      }
    </div>
  )
}
