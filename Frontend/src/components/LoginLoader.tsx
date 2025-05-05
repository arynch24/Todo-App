import loaderVideo from '../assets/loader.mp4';

export default function Loader() {
  return (
    <div className="flex items-center justify-center h-screen w-screen">
      <video
        src={loaderVideo}
        autoPlay
        loop
        muted
        className="w-96 h-96 object-contain"
      />
    </div>
  );
}