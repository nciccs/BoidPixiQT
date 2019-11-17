class QuadTree
{
    constructor(boundary, capacity, dataList = [])
    {
        this.boundary = boundary;
        this.capacity = capacity;
        this.points = [];

        this.northwest;
        this.northeast;
        this.southwest;
        this.southeast;

        for(let data of dataList)
        {
            this.insert(new Point(data.position.x, data.position.y, data));
        }
    }

    insert(point)
    {
        let success = false;
        //insert only if point is within boundary
        if(this.boundary.contains(point))
        {
            //insert if there's capacity available
            if(this.points.length < this.capacity)
            {
                this.points.push(point);
                success = true;
            }
            else
            {
                //if northwest is null, then it hasn't subdivided, so subdivide
                if(this.northwest == null)
                    this.subdivide();

                //try insert point into 4 subdivided sections, if at least 1 succeed, insert is a success
                if(this.northwest.insert(point) ||
                this.northeast.insert(point) ||
                this.southwest.insert(point) || 
                this.southeast.insert(point))
                {
                    success = true;
                }
            }
        }
        return success;
    }

    subdivide()
    {
        let x = this.boundary.x;
        let y = this.boundary.y;
        let w = this.boundary.w;
        let h = this.boundary.h;

        let nw = new Rectangle(x, y, w/2, h/2);
        let ne = new Rectangle(x+w/2, y, w/2, h/2);
        let sw = new Rectangle(x, y+h/2, w/2, h/2);
        let se = new Rectangle(x+w/2, y+h/2, w/2, h/2);

        this.northwest = new QuadTree(nw, this.capacity);
        this.northeast = new QuadTree(ne, this.capacity);
        this.southwest = new QuadTree(sw, this.capacity);
        this.southeast = new QuadTree(se, this.capacity);
    }

    //draw the entire tree graphically with p5.js
    show()
    {
        strokeWeight(1);
        noFill();

        rect(this.boundary.x, this.boundary.y, this.boundary.w, this.boundary.h);
        for(let p of this.points)
        {
            strokeWeight(4);
            point(p.x, p.y)
        }

        if(this.northwest != null)
        {
            this.northwest.show();
            this.northeast.show();
            this.southwest.show();
            this.southeast.show();
        }
    }

    //recursively grab all points within defined range, where range is a shape
    query(range)
    {
        let foundPoints = [];
        this._query(range, foundPoints);
        return foundPoints;
    }

    _query(range, foundPoints)
    {
        if(range.intersects(this.boundary))
        {
            for(let p of this.points)
            {
                if(range.contains(p))
                {
                    foundPoints.push(p);
                }
            }
        }

        if(this.northwest != null)
        {
            this.northwest._query(range, foundPoints);
            this.northeast._query(range, foundPoints);
            this.southwest._query(range, foundPoints);
            this.southeast._query(range, foundPoints);
        }
    }

    //recursively grab all points
    getAllPoints()
    {
        let allPoints = [];

        this._getAllPoints(allPoints);

        return allPoints;
    }

    _getAllPoints(allPoints)
    {
        [].push.apply(allPoints, this.points.slice());

        if(this.northwest != null)
        {
            this.northwest._getAllPoints(allPoints);
            this.northeast._getAllPoints(allPoints);
            this.southwest._getAllPoints(allPoints);
            this.southeast._getAllPoints(allPoints);
        }
    }

    move(point, x, y)
    {
        let success = false;
        if(this.removePoint(point))
        {
            point.x = x;
            point.y = y;
            success = this.insert(point);
        }
        return success;
    }

    removePoint(point)
    {
        return this._remove(point);
    }

    _remove(point)
    {
        let success = false;

        if(this.boundary.contains(point))
        {
            //find point in this level
            for(let i = 0; i < this.points.length; i++)
            {
                if(point.x == this.points[i].x && point.y == this.points[i].y && point.data === this.points[i].data)
                {
                    this.points.splice(i, 1);
                    success = true;
                }
            }

            //if has children
            if(this.northwest != null)
            {
                //if point not found, then try search next level
                if(!success)
                {
                    if(this.northwest._remove(point) ||
                        this.northeast._remove(point) ||
                        this.southwest._remove(point) ||
                        this.southeast._remove(point))
                    {
                        success = true;
                    }
                }

                //clean up empty children
                if(this.northwest.points.length == 0 && this.northwest.northwest == null &&
                    this.northeast.points.length == 0 && this.northwest.northwest == null &&
                    this.southwest.points.length == 0 && this.northwest.northwest == null &&
                    this.southeast.points.length == 0 && this.northwest.northwest == null)
                {
                    delete this.northwest;
                    delete this.northeast;
                    delete this.southwest;
                    delete this.southeast;
                }
            }
        }

        return success;
    }
}