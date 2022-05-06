import { useState } from 'react';
import bookImage from './assets/Astrophysics-for-People-in-a-Hurry-eBook.png';
import { ReactComponent as PlayAudioIcon } from './assets/audio-headphones.svg';
import AudioPlayer from './AudioPlayer';
import book from './book';
const AudioBookPlayer = () => {
  const [track, setTrack] = useState(book.chapters[0]);
  return <div className='audio-section'>
    <div className='audio-title'> Audiobook</div>
    <div className='audio-player'>
      <AudioPlayer track={track} image={bookImage} />
    </div>
    <div className='audio-book-content'>
      <div className='audio-book-content-title'>Table of contents</div>
      <div className='audio-book-content-container'>
        {book.chapters.map((chapter, index) => {
          return <div key={index} className='audio-book-content-list'>
            <div className='audio-book-content-item' onClick={() => {
              setTrack(chapter)
            }}>
              <div className='number'>{index + 1}</div> {chapter.name}</div>
            <PlayAudioIcon onClick={() => {
              setTrack(chapter)
            }} />
          </div>
        })}
      </div>
    </div>
  </div>
}

export default AudioBookPlayer;