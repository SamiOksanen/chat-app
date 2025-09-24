import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import MessageRenderer from '../components/messages/MessageRenderer';

describe('MessageRenderer', () => {
    it('renders plain text without markdown processing', () => {
        render(<MessageRenderer content="Hello World" />);
        expect(screen.getByText('Hello World')).toBeInTheDocument();
    });

    it('renders markdown bold text', () => {
        render(<MessageRenderer content="**Bold Text**" />);
        // The bold text should be rendered with strong styling
        const boldElement = screen.getByText('Bold Text');
        expect(
            boldElement.closest('[class*="ant-typography"]')
        ).toHaveAttribute('class', expect.stringContaining('ant-typography'));
    });

    it('renders markdown italic text', () => {
        render(<MessageRenderer content="*Italic Text*" />);
        const italicElement = screen.getByText('Italic Text');
        expect(italicElement).toBeInTheDocument();
    });

    it('renders markdown headings', () => {
        render(<MessageRenderer content="# Heading 1" />);
        const headingElement = screen.getByText('Heading 1');
        expect(headingElement).toBeInTheDocument();
    });

    it('renders markdown links', () => {
        render(<MessageRenderer content="[Link Text](https://example.com)" />);
        const linkElement = screen.getByRole('link', { name: 'Link Text' });
        expect(linkElement).toHaveAttribute('href', 'https://example.com');
        expect(linkElement).toHaveAttribute('target', '_blank');
    });

    it('renders markdown lists', () => {
        render(<MessageRenderer content="- Item 1\n- Item 2" />);
        // Check if the list element exists
        const list = screen.getByRole('list');
        expect(list).toBeInTheDocument();
        // Check if content includes the items (react-markdown might render them differently)
        expect(screen.getByText(/Item 1/)).toBeInTheDocument();
        expect(screen.getByText(/Item 2/)).toBeInTheDocument();
    });

    it('renders markdown blockquotes', () => {
        render(<MessageRenderer content="> This is a quote" />);
        expect(screen.getByText('This is a quote')).toBeInTheDocument();
    });

    it('renders markdown code', () => {
        render(<MessageRenderer content="`inline code`" />);
        expect(screen.getByText('inline code')).toBeInTheDocument();
    });

    it('renders strikethrough text', () => {
        render(<MessageRenderer content="~~strikethrough~~" />);
        expect(screen.getByText('strikethrough')).toBeInTheDocument();
    });
});
