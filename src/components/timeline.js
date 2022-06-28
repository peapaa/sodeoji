/* eslint-disable no-nested-ternary */
import { useContext, useEffect, useState } from 'react';
import Skeleton from 'react-loading-skeleton';
import LoggedInUserContext from '../context/logged-in-user';
import usePosts from '../hooks/use-posts';
import Post from './post';
import Comments from './post/comments';
import 'react-loading-skeleton/dist/skeleton.css'

export default function Timeline({ type, param2 }) {
  const { user } = useContext(LoggedInUserContext);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [value, setValue] = useState();
  const [sort, setSort] = useState('default');
  var { posts } = usePosts(type, param2, search, sort, user);

  const handleSearch = () => {
    console.log("set search: " + value);
    setSearch(value);
  }

  const handleSort = (e) => {
    setSort(e.target.value)
  }

  useEffect(() => {
    if (posts) setLoading(true);
  })

  return (
    <div key="post-list" className="container col-span-2" className={type === 'post-details' ? "max-w-screen-lg justify-between mx-auto" : "max-w-screen-md justify-between mx-auto"}>
      {type !== 'post-details' ? (
        <>
          <div key="searching-post" className='w-full pt-1 pb-1'>
            <input
              type="text"
              className="form-control"
              id="search_post"
              placeholder='Search'
              onChange={(e) => setValue(e.target.value)}
              onKeyPress={(e) => { if (e.key == "Enter") { handleSearch() } }}
            ></input>
          </div>
          <div key="sorting-post" className="form-control" style={{marginBottom: '0.25rem'}}>
            <select className="h-full w-full" onChange={(e) => handleSort(e)}>
              <option value="default">Sắp xếp</option>
              <option value="ライクでソート">Sắp xếp theo like</option>
              <option value="作成時間でソート">Sắp xếp theo thời gian</option>
            </select>
          </div>
        </>
      ) : null}
      {!loading ? (
        <Skeleton key="post-skeleton" count={4} width={640} height={500} className="mb-5" />
      ) : (
        posts.map((content) => {
          return (
            <>
              <Post key={content.key} content={content} />
              {type === 'post-details' ? (
                <Comments
                  postId={content.postId}
                  user={user}
                />
              ) : null}
            </>
          )
        })
      )}
    </div>
  );
}
