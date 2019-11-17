class Rectangle
{
    constructor(x, y, w, h)
    {
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;

        this.centerX = this.x + this.w/2;
        this.centerY = this.y + this.h/2;
    }

    contains(point)
    {
        return (this.x <= point.x && point.x <= this.x+this.w &&
            this.y <= point.y && point.y <= this.y+this.h);
    }

    intersects(range)
    {
        return !(range. x > this.x + this.w ||
            range.x + range.w < this.x ||
            range.y > this.y + this.h ||
            range.y + range.h < this.y);
    }
}