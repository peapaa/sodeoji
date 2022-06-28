import { useState, React, useContext, useEffect } from 'react';
import FirebaseContext from '../../context/firebase';
import { Fab, Grid } from '@material-ui/core';
import PhotoCamera from '@material-ui/icons/PhotoCamera';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import useUser from '../../hooks/use-user';
import UserContext from '../../context/user';
import set from 'date-fns/set';

export default function ChangePost({ type, post, handleClose }) {
    const { user: loggedInUser } = useContext(UserContext);
    const { user } = useUser(loggedInUser?.uid);
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    // const [imgPost, setImgPost] = useState('');
    const [imgSrc, setImgSrc] = useState('');
    const [fileName, setFileName] = useState('');
    const [fileSrc, setFileSrc] = useState('');
    const [active, setActive] = useState('group');
    const [alert, setAlert] = useState(false);
    const { database, storage } = useContext(FirebaseContext);

    useEffect(() => {
        if (post) {
            setTitle(post.title);
            setContent(post.content);
            setImgSrc(post.image_url);
            setFileSrc(post.file_url);
            setFileName(post.file_name);
            setActive(post?.active);
        }
    }, [])

    const handleUpdate = async (event) => {
        event.preventDefault();
        await database
            .ref('Posts')
            .child(post.key)
            .update({
                active: active,
                content: content,
                create_date: Date.now(),
                image_url: imgSrc,
                file_name: fileName,
                file_url: fileSrc,
                title: title,
            });
        window.location.reload();
    };

    const handlePost = async (event) => {
        event.preventDefault();

        var postId = database
            .ref('Posts')
            .push({
                active: active,
                postId: user?.username,
                author: user?.username,
                author_avatar: user?.avatar,
                content: content,
                create_date: Date.now(),
                group: user?.group,
                image_url: imgSrc,
                file_name: fileName,
                file_url: fileSrc,
                title: title,
                vote_numbers: 0
            })
            .key;
        var postRef = 'Posts/' + postId;
        database
            .ref(postRef)
            .update({
                postId: postId
            });
        window.location.reload();
    };

    const onImageChange = (event) => {

        // console.log(event.target.files.length);
        if (event.target.files && event.target.files[event.target.files.length - 1]) {
            if (imgSrc !== '') {
                storage.refFromURL(imgSrc).delete().then(() => {
                    // console.log('success delete');
                }).catch((error) => {
                    // console.log('fail delete');
                });
            }
            setImgSrc('');
            let reader = new FileReader();
            // reader.onload = (e) => {
            //     setImgPost({ image: e.target.result });
            // };
            reader.readAsDataURL(event.target.files[event.target.files.length - 1]);
            const file = event.target.files[event.target.files.length - 1];
            const storageRef = storage.ref();
            let urlName = Date.now() + file.name;
            const fileRef = storageRef.child(`/posts/${urlName}`);
            fileRef.put(file).then(() => {
                fileRef.getDownloadURL().then(function (url) {
                    if (imgSrc !== '') {
                        storage.refFromURL(imgSrc).delete().then(() => {
                            console.log('success delete');
                        }).catch((error) => {
                            console.log('fail delete');
                        });
                    }
                    // console.log(url);
                    setImgSrc(url);
                });
            })
        }
    }

    const onFileChange = (event) => {
        setAlert(false);
        if (event.target.files && event.target.files[event.target.files.length - 1]) {
            if (fileSrc !== '') {
                storage.refFromURL(fileSrc).delete().then(() => {
                    // console.log('success delete');
                }).catch((error) => {
                    // console.log('fail delete');
                });
            }
            setFileSrc('');
            let reader = new FileReader();
            // reader.onload = (e) => {
            //     setImgPost({ image: e.target.result });
            // };
            reader.readAsDataURL(event.target.files[event.target.files.length - 1]);
            const file = event.target.files[event.target.files.length - 1];
            setFileName(file.name);
            if (file.size > 31457280) {
                setAlert(true);
            } else {
                const storageRef = storage.ref();
                let urlName = Date.now() + file.name;
                const fileRef = storageRef.child(`/posts_file/${urlName}`);
                fileRef.put(file).then(() => {
                    fileRef.getDownloadURL().then(function (url) {
                        if (fileSrc !== '') {
                            storage.refFromURL(fileSrc).delete().then(() => {
                                console.log('success delete');
                            }).catch((error) => {
                                console.log('fail delete');
                            });
                        }
                        setFileSrc(url);
                        // console.log(fileName, fileSrc);
                    });
                })
            }

        }
    }

    const handleCloseEvent = async () => {
        if (type !== "編集") {
            if (imgSrc !== '') {
                storage.refFromURL(imgSrc).delete().then(() => {
                    // console.log('success delete');
                }).catch((error) => {
                    // console.log('fail delete');
                });
            }
            if (fileSrc !== '') {
                storage.refFromURL(fileSrc).delete().then(() => {
                    // console.log('success delete');
                }).catch((error) => {
                    // console.log('fail delete');
                });
            }
        }
        handleClose();
    };

    return (
        <>
            <div className="flex flex-col bg-white p-4 rounded width-post">
                <div className="p-4 py-5">
                    <Grid container justifyContent="center" alignItems="center">
                        <input
                            accept="image/*"
                            id="contained-button-image-file"
                            multiple
                            type="file"
                            onChange={onImageChange}
                            hidden={true}
                        />
                        <label htmlFor="contained-button-image-file">
                            <Fab component="span">
                                <PhotoCamera />
                            </Fab>
                        </label>
                    </Grid>
                    {imgSrc !== '' ? (<div className="padding-login flex items-center justify-center"><img id="target" src={imgSrc} alt="" /></div>) : null}
                </div>

                <div className="p-4 py-5 flex flex-col items-center">
                    <Grid container justifyContent="center" alignItems="center">
                        <input
                            accept='.txt,.doc,.docx,.xml,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,.pdf'
                            id="contained-button-file"
                            multiple
                            type="file"
                            onChange={onFileChange}
                            hidden={true}
                        />
                        <label htmlFor="contained-button-file">
                            <Fab component="span">
                                <CloudUploadIcon />
                            </Fab>
                        </label>
                    </Grid>
                    {fileSrc !== '' ? (<div className="padding-login flex items-center justify-center"><a href={fileSrc} download>{fileName}</a></div>) : null}
                    {alert ? (
                        <strong className='pt-1'>Chỉ các tệp dưới 30mb mới có thể được tải lên!</strong>
                    ) : null}
                </div>
                <label>
                    Hiển thị:
                    <select class="form-select mb-2" aria-label="Default select example" defaultValue={active} onChange={({ target }) => setActive(target.value)}>
                        <option value="all">Tất cả các nhóm</option>
                        <option value="group">Người dùng của nhóm</option>
                    </select>
                </label>

                <label>
                    Tiêu đề:
                    <input
                        type="text"
                        defaultValue={title}
                        className="text-sm text-gray-base w-full mr-3 py-5 px-4 h-2 border border-gray-primary rounded mb-2"
                        onChange={({ target }) => setTitle(target.value)}
                    />
                </label>
                <label>
                    Nội dung:
                    <textarea
                        defaultValue={content}
                        className="text-sm text-gray-base w-full mr-3 p-4 h-40 border border-gray-primary rounded mb-2"
                        onChange={({ target }) => setContent(target.value)}
                    />
                </label>
                <div>
                    <button className={`bg-blue-medium text-white w-45 rounded h-8 font-bold ${(content === '' || title === '') && 'opacity-50'} `}
                        disabled={content === '' || title === ''}
                        onClick={type === "編集" ? (handleUpdate) : (handlePost)}> {type}
                    </button>
                    <a className={`pt-1`}> </a>

                    <button className={`bg-red-medium text-white w-45 rounded h-8 font-bold`}
                        onClick={handleCloseEvent}
                    > Hủy
                    </button>
                </div>
            </div>
        </>
    );
}
