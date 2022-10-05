import React from "react";
import { render, screen } from "@testing-library/react";
import Todo from ".";

describe("<Todo />", () => {
  test("rendered text", () => {
    render(<Todo defaultItems={[]} onChange={() => {}} />);
    expect(screen.getByPlaceholderText("Add item.")).toBeDefined();
  });
});
