// import { useRef } from 'react';
import PropTypes from 'prop-types';
import Header from './header';
import Image from './image';
import Body from './body';
import Footer from './footer';

export default function Post({ content }) {
   return (
    <div className="rounded col-span-4 border bg-white border-gray-primary mb-12">
      <Header username={content?.author} avatarSrc={content?.author_avatar} date={content?.create_date} content={content}/>
      <Image src={content?.image_url}/>
      <Body fileName={content?.file_name} fileUrl={content?.file_url} postId={content?.postId} title={content?.title} content={content?.content}/>
      <Footer votes={content?.vote_numbers} comments={content?.comment_numbers} content={content}/>
    </div>
  );
}

Post.propTypes = {
  content: PropTypes.shape({
    postId: PropTypes.string.isRequired,
    author: PropTypes.string.isRequired,
    author_avatar: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    content: PropTypes.string.isRequired,
    create_date: PropTypes.number.isRequired,
    vote_numbers: PropTypes.number.isRequired,
    comments: PropTypes.oneOfType([
      PropTypes.array.isRequired,
      PropTypes.object.isRequired
    ])
  })
};
