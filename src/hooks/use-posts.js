import { useState, useEffect } from 'react';
import { getPosts } from '../services/firebase';

export default function usePosts(type, param2, search, sort, user) {
  const [posts, setPosts] = useState();

  useEffect(() => {
    async function getTimelinePosts() {
      const PostList = await getPosts(type, param2, search, user);
      switch (sort) {
        case 'A':
          PostList.sort((a, b) => {
            return b.vote_numbers - a.vote_numbers;
          });
          break;
        case 'B':
          PostList.sort((a, b) => {
            return b.create_date - a.create_date;
          });
          break;
        default:
          PostList.sort((a, b) => {
            if (b.vote_numbers !== a.vote_numbers) return b.vote_numbers - a.vote_numbers;
            return b.create_date - a.create_date;
          });
          break;
  
      }

      setPosts(PostList);
    }

    getTimelinePosts();
  }, [user, search, sort, posts?.length]);

  return { posts, sort };
}
