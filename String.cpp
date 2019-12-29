#include <iostream>
#include <string>
#include <cctype>
using namespace std;

class Palindrome
{
public:
	string str, pal[20], oldstr;
	int s_size, ind;
	Palindrome()
	{
		cout << "Enter String " << endl;
		getline(cin, oldstr);
		cout << "Entered String is " << oldstr << endl;
		removeSpecials();
		s_size = str.size();
		ind = 0;
	}
	void removeSpecials()
	{
		string temp = "";
		char t;
		for (int i = 0; i < oldstr.size(); i++)
		{
			if ((oldstr[i] != ' ') && (oldstr[i] != '\'') && (oldstr[i] != '"') && (oldstr[i] != ',') && (oldstr[i] != '-') && (oldstr[i] != '.') && (oldstr[i] != '?'))
			{
				t = tolower(oldstr[i]);
				temp.push_back(t);
			}
		}
		this->str = temp;
		cout << str;
	}
	/*
	void palindrome_odd_check(int i)
    {
		if(i<s_size)
		{
			string temp;
			for(int j=1;j<s_size&&str[i-j]!='\0'&&str[i+j]!='\0';j++)
			{
				if(str[i-j]==str[i+j])
					{
						temp.insert(0,1,str[i]);
						temp=str[i-j]+temp;
						temp=temp+str[i+j];
					}
					
			}
			make_array(temp);
			i++;
			palindrome_odd_check(i);
		}
	}
	*/
	void palindromeOddCheck(int i)
	{
		if (i < s_size)
		{
			string temp;
			temp.insert(0, 1, str[i]);
			for (int j = 1; j <= i && j <= s_size - i; j++)
			{
				if (str[i - j] == str[i + j])
				{
					temp = str[i - j] + temp;
					temp = temp + str[i + j];
				}
				else
				{
					break;
				}
			}
			make_array(temp);
		}
	}
	/*
	void palindrome_even_check(int i)
	{
		if(i<s_size-1)
		{
			string temp;
			if(str[i]==str[i+1])
			{
			temp.insert(0,1,str[i]);
			temp.insert(1,1,str[i+1]);
			
			for(int j=1;j<s_size&&str[i-j]!='\0'&&str[i+1+j]!='\0';j++)
			{
				if(str[i-j]==str[i+1+j])
					{
						temp=str[i-j]+temp;
						temp=temp+str[i+1+j];
					}
			}
			make_array(temp);
			}
			i++;
			palindrome_even_check(i);
		}
	}
	*/
	void palindromeEvenCheck(int i)
	{
		string temp;
		temp.insert(0, 1, str[i]);
		temp.insert(1, 1, str[i + 1]);
		for (int j = 1; j <= i && j < s_size - i; j++)
		{
			if (str[i - j] == str[i + j + 1])
			{
				temp = str[i - j] + temp;
				temp = temp + str[i + j + 1];
			}
			else
			{
				break;
			}
		}
		make_array(temp);
	}

	void make_array(string s1)
	{
		if (s1.length() > 2)
		{
			pal[ind] = s1;
			ind++;
		}
	}
	void display()
	{
		cout << "There are " << ind << " palindrome Substrings \n";
		for (int i = 0; i < ind; i++)
		{
			cout << "Palindrome String is " << pal[i] << endl;
		}
	}
};
int main()
{
	Palindrome obj;
	for (int i = 1; i < obj.s_size; i++)
	{
		obj.palindromeOddCheck(i);
		obj.palindromeEvenCheck(i);
	}

	//obj.palindrome_even_check(1);
	obj.display();
}