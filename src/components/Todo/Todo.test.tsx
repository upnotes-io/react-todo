import React from "react";
import { render, screen } from "@testing-library/react";
import Todo from ".";

describe("<Todo /> component", () => {
  it("shows text input with `Add Item.` placeholder is defined", () => {
    const mockHandleChange = jest.fn();

    render(<Todo defaultItems={[]} onChange={mockHandleChange} />);
    expect(screen.getByPlaceholderText("Add item.")).toBeDefined();
  });
});
