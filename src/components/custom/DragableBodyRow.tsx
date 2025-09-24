import { useDrag, useDrop } from 'react-dnd'
import { XYCoord } from 'dnd-core'
import { useRef } from 'react'

const type = 'DragableBodyRow'

interface DragableBodyRowProps extends React.HTMLAttributes<HTMLTableRowElement> {
    index: number
    moveRow: (dragIndex: number, hoverIndex: number) => void
}

export const DragableBodyRow: React.FC<DragableBodyRowProps> = ({ index, moveRow, className, style, ...restProps }) => {
    const ref = useRef<HTMLTableRowElement>(null)

    const [, drop] = useDrop({
        accept: type,
        hover(item: { index: number }, monitor) {
            if (!ref.current) return
            const dragIndex = item.index
            const hoverIndex = index

            if (dragIndex === hoverIndex) return

            const hoverBoundingRect = ref.current?.getBoundingClientRect()
            const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2
            const clientOffset = monitor.getClientOffset()
            const hoverClientY = (clientOffset as XYCoord).y - hoverBoundingRect.top

            if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) return
            if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) return

            moveRow(dragIndex, hoverIndex)
            item.index = hoverIndex
        }
    })

    const [{ isDragging }, drag] = useDrag({
        type,
        item: { index },
        collect: (monitor) => ({
            isDragging: monitor.isDragging()
        })
    })

    drag(drop(ref))

    return (
        <tr
            ref={ref}
            className={className}
            style={{ ...style, cursor: 'move', opacity: isDragging ? 0.5 : 1 }}
            {...restProps}
        />
    )
}
