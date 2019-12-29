// Raw code with nothing but a determinant finding CMD commands
#include <iostream>
#include <cmath>
using namespace std;
class Matrix
{
public:
	const int dim;
	double **matr = NULL;		  //pointer to the Matrix
	int *indexMatr = new int[10]; //for the index not to take in sum
	double detSum;				  //for determinant sums
	int stepCnt;				  //for levels of indices
	Matrix(int d) : dim(d)		  //constructor
	{
		createMatrix(dim);
		acceptElements();
	}
	~Matrix()
	{
		for (int i = 0; i < dim; i++)
		{
			delete[] matr[i];
		}
		delete[] matr;
		delete[] indexMatr;
	}
	void createMatrix(int);
	void acceptElements();
	double cofact(int);
	void determinant();
	void exclIndex(int);
	void indexReset();
	void lastIndexReset(int);
	bool validIndex(int);
	void display();
};

void Matrix::createMatrix(int dim)
{
	matr = new double *[dim];
	for (int i = 0; i < dim; i++)
	{
		matr[i] = new double[dim];
	}
}

void Matrix::acceptElements()
{
	cout << "Enter Elements in Matrix:" << endl;
	for (int i = 0; i < dim; i++)
	{
		for (int j = 0; j < dim; j++)
		{
			cout << "Enter : A[" << i << "][" << j << "] : ";
			cin >> matr[i][j];
		}
		cout << endl;
	}
}

void Matrix::determinant()
{
	stepCnt = 0;
	indexReset();
	detSum = cofact(0);
}

void Matrix::indexReset()
{
	for (int row = 0; row < dim; row++)
	{
		indexMatr[row] = -1;
	}
}

void Matrix::lastIndexReset(int reset)
{
	indexMatr[reset] = -1;
}

void Matrix::exclIndex(int j)
{
	int ctr;
	for (ctr = 0; ctr < stepCnt; ctr++)
	{
	}
	indexMatr[ctr] = j;
}

bool Matrix::validIndex(int j)
{
	int iRet = 0;
	for (int fcnt = 0; fcnt <= stepCnt; fcnt++)
	{
		if (j != indexMatr[fcnt])
		{
			iRet++;
		}
	}
	if (iRet == stepCnt + 1)
	{
		return true;
	}
	else
		return false;
}

double Matrix::cofact(int i)
{

	if (i == dim - 1)
	{
		for (int lcnt = 0; lcnt < dim; lcnt++)
		{
			if (validIndex(lcnt))
			{
				stepCnt--;
				return matr[i][lcnt];
			}
		}
	}
	else
	{

		int sum = 0;

		int power = 0;
		for (int cnt = 0; cnt < dim; cnt++)
		{
			if (validIndex(cnt))
			{
				exclIndex(cnt);
				stepCnt++; //for Incrementing the Determinant Levels
				sum += pow(-1, power) * matr[i][cnt] * cofact(i + 1);
				lastIndexReset(stepCnt);
				power++;
			}
		}
		stepCnt--;
		return sum;
	}
}

void Matrix::display()
{
	cout << "The Determinant is " << detSum;
}

int main()
{
	int dim;
	cout << "Enter The Dimension of Square Matrix" << endl;
	cin >> dim;
	Matrix obj(dim);
	obj.determinant();
	obj.display();
}