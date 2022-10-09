import React, { FC, useState, useRef, useLayoutEffect, ReactNode } from 'react';
import { clsx } from 'clsx';
import styles from './style.module.css';

interface AccordionProps {
    title: string;
    defaultExpanded?: boolean;
    children: ReactNode
}

interface ArrowIconProps {
    open: boolean
}

const ArrowIcon:FC<ArrowIconProps> = ({ open }) => {
    return (
        <svg 
            className={clsx(
                styles['arrow_icon'],
                styles[open ? 'arrow_icon--open' : 'arrow_icon--close']
            )} 
            focusable="false" 
            viewBox="0 0 24 24" 
            aria-hidden="true"
        >
            <path d="M16.59 8.59L12 13.17 7.41 8.59 6 10l6 6 6-6z"></path>
        </svg>
    )
}

export const Accordion:FC<AccordionProps> = ({
    title,
    defaultExpanded = true,
    children
}) => {
    const accordionBodyRef = useRef<HTMLDivElement>(null);

    const [open, setOpen] = useState(defaultExpanded);
    const handleToggle = () => setOpen(open => !open);

    
    useLayoutEffect(() => {
        if(!accordionBodyRef.current) return;
        // to get slide effet changing maxHeight
        const panel = accordionBodyRef.current;
        panel.style.maxHeight = (
            open ? panel.scrollHeight : 0
        ) + 'px';
    }, [open])

    return (
        <div className={styles['accordion']}>
            <div 
                className={styles['accordion__title']}
                onClick={handleToggle}
            >
                {title}
                <ArrowIcon open={open}/>
            </div>

            <div 
                ref={accordionBodyRef}
                className={clsx(
                    styles['accordion__body'],
                    styles[open ? 'accordion__open' : 'accordion__close']
                )}
            >
                {children}
            </div>
        </div>
    )
}