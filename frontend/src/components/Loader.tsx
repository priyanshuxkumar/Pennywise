import { LoaderCircle } from 'lucide-react';

interface LoaderProp {
    strokeWidth: string;
    size: string;
}

export default function Loader({ strokeWidth = '2px', size = '1.5px' }: LoaderProp) {
    return (
        <div className="animate-spin">
            <LoaderCircle color={'white'} strokeWidth={strokeWidth} size={size} />
        </div>
    );
}