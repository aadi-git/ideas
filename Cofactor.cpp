// A Code with matrix cofactor finding, for particular entry or the whole cofactor matrix
// Also finds the determinant

#include <iostream>
#include <cmath>

using namespace std;
class Matrix
{
public:
	//Characteristics Declarations
	const int dim;		   //Dimension of Square Matrix
	double **matr;		   //Pointer to the Actual Matrix
	double **cofactorMatr; //Pointer to the Cofactor Matrix
	int *indexRow;		   //for the Index of Row
	int *indexCol;		   //for the Index of Column
	int *power;			   //for the Sign of Each Element
	int stepCnt;		   //Counting Levels

	//Constructor & Destructor Declaration
	Matrix(int);
	~Matrix();

	//Function Declarations
	void createMatrix(int);		 //Matrix Creation
	void refreshCofactor();		 //All Cofactor Values Assigned to 0
	void acceptElements();		 //Accepting Elements into Matrix
	void findCofactor(int, int); //Finding Specific Cofactor
	void excludeIndex(int, int);	//For Excluding Index to not take in Next Level
	void indexReset();			 //For Resetting Indices to -1 for new Cofactor
	void lastIndexReset(int);
	bool validColumn(int);
	void display(); //Displaying the array.
	void setIndexCofact(int);
	void cofactor();
	void cofactorAll();
	void Determinant();
};

// Constructor with Constant initialised in the class
Matrix::Matrix(int d) : dim(d)
{
	createMatrix(dim);
	refreshCofactor();
	acceptElements();
	indexRow = new int[dim];
	indexCol = new int[dim];
	power = new int[dim];
}

// Create two empty matrices in the memory for matrix and cofactors (a dim x dim array)
void Matrix::createMatrix(int dim)
{
	matr = new double *[dim];
	cofactorMatr = new double *[dim];
	for (int i = 0; i < dim; i++)
	{
		matr[i] = new double[dim];
		cofactorMatr[i] = new double[dim];
	}
}

// Set all entries of cofactor matrix to 0 to remove garbage values
void Matrix::refreshCofactor()
{
	for (int i = 0; i < dim; i++)
	{
		for (int j = 0; j < dim; j++)
		{
			cofactorMatr[i][j] = 0;
		}
	}
}

void Matrix::acceptElements()
{
	cout << "Enter Elements in Matrix:" << endl;
	for (int i = 0; i < dim; i++)
	{
		for (int j = 0; j < dim; j++)
		{
			cout << "A[" << i << "][" << j << "] : ";
			cin >> matr[i][j];
		}
		cout << endl;
	}
}

// resetting indices of row and column which are used for finding cofactor of particular element
void Matrix::indexReset()
{
	for (int i = 0; i < dim; i++)
	{
		indexRow[i] = -1;
		indexCol[i] = -1;
	}
}

// Resetting last index when looping back 
void Matrix::lastIndexReset(int reset)
{
	indexRow[reset] = -1;
	indexCol[reset] = -1;
}

// The array of indices which will create cofactor of a single element in the matrix
void Matrix::excludeIndex(int row, int col)
{
	indexRow[stepCnt] = row;
	indexCol[stepCnt] = col;
}

// Determining if the column of an element in matrix is valid for finding cofactor of the element 
bool Matrix::validColumn(int col)
{
	int iRet = 0;
	for (int fcnt = 0; fcnt < stepCnt; fcnt++)
	{
		if (col != indexCol[fcnt])
		{
			iRet++;
		}
	}
	if (iRet == stepCnt)
	{
		return true;
	}
	else
		return false;
}

void Matrix::display()
{
	cout << "The Cofactor Matrix is " << endl;
	for (int i = 0; i < dim; i++)
	{
		for (int j = 0; j < dim; j++)
		{
			cout << "C[" << i << "][" << j << "] : " << cofactorMatr[i][j] << "\t";
		}
		cout << endl;
	}
}

// Recursive function to find next element to multiply in cofactor of an element in Matrix 
void Matrix::setIndexCofact(int irow)
{
	if (stepCnt == dim)
	{
		cofactor();
	}
	else
	{
		if (irow != indexRow[0])
		{
			int pwr = 0;
			for (int icol = 0; icol < dim; icol++)
			{
				if (validColumn(icol))
				{
					power[stepCnt] = pow(-1, pwr);
					excludeIndex(irow, icol);
					stepCnt++;
					setIndexCofact(irow + 1);
					stepCnt--;
					lastIndexReset(stepCnt);
					pwr++;
				}
			}
		}
		else
		{
			setIndexCofact(irow + 1);
		}
	}
}

// Finding cofactor of all the elements 
void Matrix::cofactorAll()
{
	for (int i = 0; i < dim; i++)
	{
		for (int j = 0; j < dim; j++)
		{
			findCofactor(i, j);
		}
	}
}

void Matrix::findCofactor(int row, int col)
{
	indexReset();
	stepCnt = 0;
	excludeIndex(row, col);
	stepCnt++;
	setIndexCofact(0);
}

void Matrix::cofactor()
{
	double sum = 1;
	for (int i = 1; i < dim; i++)
	{
		sum *= power[i] * matr[indexRow[i]][indexCol[i]];
	}
	cofactorMatr[indexRow[0]][indexCol[0]] += sum;
}

void Matrix::Determinant()
{
	double det = 0, p = 0;
	for (int i = 0; i < dim; i++)
	{
		findCofactor(1, i);
		det += pow(-1, p) * matr[0][i] * cofactorMatr[0][i];
		p++;
	}
	cout << "The Determinant is :" << det;
}

Matrix::~Matrix() //Destructor
{
	for (int i = 0; i < dim; i++)
	{
		delete[] matr[i];
		delete[] cofactorMatr[i];
	}
	delete[] matr;
	delete[] cofactorMatr;
	delete[] indexRow;
	delete[] indexCol;
	delete[] power;
}

int main()
{
	int dim, ch, i, j;
	cout << "Enter The Dimension of Square Matrix" << endl;
	cin >> dim;
	Matrix obj(dim);

	obj.cofactorAll();
	do
	{
		cout << "\n1.Find Cofactor Matrix \n2.Find Determinant \n3.Find Cofactor of a Specific Element \n0.Quit" << endl;
		cin >> ch;
		switch (ch)
		{
		case 0:
			exit(0);
		case 1:
			obj.display();
			break;
		case 2:
			obj.Determinant();
			break;
		case 3:
			cout << "Enter Row and Column" << endl;
			cin >> i >> j;
			if ((i < dim) && (i > 0) && (j < dim) && (i > 0))
			{
				cout << obj.cofactorMatr[i][j];
			}
			else
			{
				cout << "Invalid indices\nTryAgain";
			}
			break;
		default:
			cout << "Wrong Choice \n";
		}
	} while (ch != 0);
}
