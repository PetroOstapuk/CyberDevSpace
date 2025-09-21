export default function Image({ src, alt = 'Image', width = 300, height = 400, align = 'none' }) {
    return (
        <div align={align}>
            <img src={src} alt={alt} width={width} height={height} />
        </div>
    );
}