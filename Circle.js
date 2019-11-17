class Circle
{
    constructor(x, y, r)
    {
        this.x = x;
        this.y = y;
        this.r = r;
    }

    contains(point)
    {
        let dx = point.x - this.x;
        let dy = point.y - this.y;
        return (dx*dx + dy*dy) <= this.r*this.r;
    }

    intersects(range)
    {
        let distX = Math.abs(this.x - (range.x + range.w / 2));
        let distY = Math.abs(this.y - (range.y + range.h / 2));

        let isIntersecting = false;

        //intersecting if distance between centres is within rect's half width or height
        if(distX <= (range.w/2) || distY <= (range.h/2))
        {
            isIntersecting = true;
        }
        else
        {
            let dx = distX - range.w/2;
            let dy = distY - range.h/2;
            if(dx*dx + dy*dy <= (this.r*this.r))
            {
                isIntersecting = true;
            }
        }

        return isIntersecting;
    }
}