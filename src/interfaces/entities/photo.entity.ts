export interface IPhoto{
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

export interface IPhotoCreate {
    name: string;
    description: string;
    startingPrice: number;
    endingPrice: number;
    blocked?: boolean;
  }