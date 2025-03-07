export interface IDecoration{
    _id: string;
    name: string;
    description: string;
    estimatedCost: {
      max: number;
      min: number;
    };
    list: boolean;
    createdAt: Date;
    updatedAt: Date;
}

export interface IDecorationCreate {
    name: string;
    description: string;
    startingPrice: number;
    endingPrice: number;
    blocked?: boolean;
  }